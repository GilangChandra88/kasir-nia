import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  type Transaction,
  type Unsubscribe,
} from 'firebase/firestore'

import { UserFacingError } from '@/domain/errors'
import type { InviteDraft } from '@/domain/team'
import type { AuthUser, Invite, Member } from '@/domain/types'

import { errorCode } from './errors'
import { db } from './firebase'
import { parseInvite, parseMember } from './schemas'
import { runTimedTransaction } from './transaction'

/**
 * Undangan disimpan dua kali dalam satu transaksi:
 * - `invites/{email}` (tingkat atas): ditemukan kasir saat login lewat emailnya.
 * - `stores/{toko}/invites/{email}`: daftar undangan yang dilihat pemilik.
 */
const lookupRef = (email: string) => doc(db, 'invites', email)
const storeInviteRef = (storeId: string, email: string) =>
  doc(db, 'stores', storeId, 'invites', email)
const memberRef = (storeId: string, uid: string) => doc(db, 'stores', storeId, 'members', uid)

type TeamSnapshot = { members: Member[]; invites: Invite[] }

/** Memantau anggota toko & undangan yang belum diklaim (khusus pemilik). */
export function watchTeam(
  storeId: string,
  onData: (team: TeamSnapshot) => void,
  onError: (error: unknown) => void,
): Unsubscribe {
  let members: Member[] | null = null
  let invites: Invite[] | null = null
  const emit = () => {
    if (members && invites) onData({ members, invites })
  }

  const stopMembers = onSnapshot(
    collection(db, 'stores', storeId, 'members'),
    (snapshot) => {
      members = snapshot.docs.flatMap((item) => parseMember(item.id, item.data()) ?? [])
      emit()
    },
    onError,
  )
  const stopInvites = onSnapshot(
    collection(db, 'stores', storeId, 'invites'),
    (snapshot) => {
      invites = snapshot.docs.flatMap((item) => parseInvite(item.id, item.data()) ?? [])
      emit()
    },
    onError,
  )
  return () => {
    stopMembers()
    stopInvites()
  }
}

/** Undangan lain untuk email ini tidak boleh ada (pemilik toko lain tak bisa membacanya → ditolak). */
async function assertNotInvited(tx: Transaction, email: string): Promise<void> {
  let exists: boolean
  try {
    exists = (await tx.get(lookupRef(email))).exists()
  } catch (error) {
    if (errorCode(error) !== 'permission-denied') throw error
    exists = true
  }
  if (exists) throw new UserFacingError('Email ini sudah punya undangan dari sebuah toko.')
}

type InviteCashierInput = {
  storeId: string
  storeName: string
  ownerUid: string
  /** Sudah divalidasi (`domain/team.ts`): email huruf kecil, nama rapi. */
  invite: InviteDraft
}

/** Mendaftarkan email Google calon kasir. Kasir bergabung otomatis saat login. Wajib online. */
export async function inviteCashier({
  storeId,
  storeName,
  ownerUid,
  invite,
}: InviteCashierInput): Promise<void> {
  const data = {
    storeId,
    storeName,
    displayName: invite.displayName,
    invitedBy: ownerUid,
    createdAt: serverTimestamp(),
  }
  await runTimedTransaction(async (tx) => {
    await assertNotInvited(tx, invite.email)
    tx.set(storeInviteRef(storeId, invite.email), data)
    tx.set(lookupRef(invite.email), data)
  })
}

/** Membatalkan undangan yang belum diklaim. */
export async function cancelInvite(storeId: string, email: string): Promise<void> {
  await runTimedTransaction((tx) => {
    tx.delete(lookupRef(email))
    tx.delete(storeInviteRef(storeId, email))
    return Promise.resolve()
  })
}

/** Mengaktifkan/menonaktifkan kasir. Kasir nonaktif langsung kehilangan akses (dijaga rules). */
export async function setMemberActive(
  storeId: string,
  uid: string,
  isActive: boolean,
): Promise<void> {
  await runTimedTransaction((tx) => {
    tx.update(memberRef(storeId, uid), { isActive, updatedAt: serverTimestamp() })
    return Promise.resolve()
  })
}

/** Undangan untuk email akun yang sedang login, atau null. */
export async function findInvite(email: string): Promise<Invite | null> {
  if (email === '') return null
  const snapshot = await getDoc(lookupRef(email))
  return snapshot.exists() ? parseInvite(snapshot.id, snapshot.data()) : null
}

/**
 * Kasir mengklaim undangannya: menjadi anggota toko, `users/{uid}` dibuat, undangan dihapus —
 * semua dalam satu transaksi. Ditolak bila akun ini sudah punya toko (1 akun = 1 toko).
 */
export async function claimInvite(user: AuthUser, invite: Invite): Promise<void> {
  const userRef = doc(db, 'users', user.uid)
  const displayName = invite.displayName || user.displayName

  await runTimedTransaction(async (tx) => {
    if ((await tx.get(userRef)).exists()) {
      throw new UserFacingError('Akun ini sudah terdaftar di toko lain.')
    }
    if (!(await tx.get(lookupRef(invite.email))).exists()) {
      throw new UserFacingError('Undangan sudah dibatalkan pemilik toko.')
    }

    tx.set(memberRef(invite.storeId, user.uid), {
      role: 'cashier',
      displayName,
      email: invite.email,
      isActive: true,
      joinedAt: serverTimestamp(),
    })
    tx.set(userRef, {
      storeId: invite.storeId,
      role: 'cashier',
      displayName,
      email: invite.email,
      createdAt: serverTimestamp(),
    })
    tx.delete(lookupRef(invite.email))
    tx.delete(storeInviteRef(invite.storeId, invite.email))
  })
}
