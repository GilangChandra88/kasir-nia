import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore'

import { normalizeEmail } from '@/domain/team'
import type { AuthUser, Member, Session, StoreInfo, UserProfile } from '@/domain/types'

import { describeError, errorCode } from './errors'
import { auth, db } from './firebase'
import { parseMember, parseStore, parseUserProfile } from './schemas'
import { claimInvite, findInvite } from './teamRepo'

type Emit = (session: Session) => void

const BLOCKED_MESSAGE = 'Akses Anda ke toko ini sudah dinonaktifkan. Hubungi pemilik toko.'
const BROKEN_MESSAGE = 'Data akun tidak lengkap. Hubungi pemilik toko atau pengembang.'

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName ?? '',
    email: normalizeEmail(user.email ?? ''),
    photoURL: user.photoURL,
  }
}

function sessionError(user: AuthUser, error: unknown): Session {
  const message = errorCode(error) === 'permission-denied' ? BLOCKED_MESSAGE : describeError(error)
  return { status: 'error', message, user }
}

/**
 * Langkah 3: pantau toko DAN keanggotaan sendiri. Kasir yang dinonaktifkan pemilik langsung
 * kehilangan akses (dokumen anggotanya berubah → aturan menolak → layar "akses dinonaktifkan").
 */
function watchStoreAccess(user: AuthUser, profile: UserProfile, emit: Emit): Unsubscribe {
  let store: StoreInfo | null = null
  let member: Member | null = null
  const fail = (error: unknown) => {
    emit(sessionError(user, error))
  }
  const emitWhenReady = () => {
    if (store && member) emit({ status: 'ready', user, profile, store, member })
  }

  const stopStore = onSnapshot(
    doc(db, 'stores', profile.storeId),
    (snapshot) => {
      store = parseStore(snapshot.id, snapshot.data())
      if (store) emitWhenReady()
      else emit({ status: 'error', message: BROKEN_MESSAGE, user })
    },
    fail,
  )
  const stopMember = onSnapshot(
    doc(db, 'stores', profile.storeId, 'members', user.uid),
    (snapshot) => {
      member = parseMember(snapshot.id, snapshot.data())
      if (member?.isActive) emitWhenReady()
      else emit({ status: 'error', message: BLOCKED_MESSAGE, user })
    },
    fail,
  )
  return () => {
    stopStore()
    stopMember()
  }
}

/** Akun tanpa toko: bila emailnya diundang, otomatis jadi kasir; bila tidak, buat toko sendiri. */
async function joinByInvite(user: AuthUser, emit: Emit, isStopped: () => boolean) {
  try {
    const invite = await findInvite(user.email)
    if (isStopped()) return
    if (!invite) {
      emit({ status: 'needsStore', user })
      return
    }
    // Berhasil → dokumen users/{uid} muncul → pemantau profil melanjutkan ke toko.
    await claimInvite(user, invite)
  } catch (error) {
    if (!isStopped()) emit(sessionError(user, error))
  }
}

/** Langkah 2: cari toko milik akun lewat `users/{uid}`. */
function watchProfile(user: AuthUser, emit: Emit): Unsubscribe {
  let stopAccess: Unsubscribe | undefined
  let stopped = false
  let joining = false

  const stopProfile = onSnapshot(
    doc(db, 'users', user.uid),
    (snapshot) => {
      stopAccess?.()
      stopAccess = undefined

      if (!snapshot.exists()) {
        // Dari cache saat offline, "tidak ada" belum tentu benar → tunggu jawaban server.
        if (snapshot.metadata.fromCache || joining) return
        joining = true
        void joinByInvite(user, emit, () => stopped).finally(() => {
          joining = false
        })
        return
      }
      const profile = parseUserProfile(snapshot.data())
      if (!profile) {
        emit({ status: 'error', message: BROKEN_MESSAGE, user })
        return
      }
      stopAccess = watchStoreAccess(user, profile, emit)
    },
    (error) => {
      emit(sessionError(user, error))
    },
  )

  return () => {
    stopped = true
    stopAccess?.()
    stopProfile()
  }
}

/**
 * Memantau sesi: akun Google → profil (`users/{uid}`) → toko & keanggotaan.
 * Setiap perubahan dikirim ke `emit`. Mengembalikan fungsi untuk berhenti memantau.
 */
export function watchSession(emit: Emit): Unsubscribe {
  let stopProfile: Unsubscribe | undefined

  const stopAuth = onAuthStateChanged(auth, (firebaseUser) => {
    stopProfile?.()
    stopProfile = undefined

    if (!firebaseUser) {
      emit({ status: 'signedOut' })
      return
    }
    emit({ status: 'loading' })
    stopProfile = watchProfile(toAuthUser(firebaseUser), emit)
  })

  return () => {
    stopProfile?.()
    stopAuth()
  }
}
