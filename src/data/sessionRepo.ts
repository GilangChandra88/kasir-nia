import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore'

import type { AuthUser, Session, UserProfile } from '@/domain/types'

import { describeError, errorCode } from './errors'
import { auth, db } from './firebase'
import { parseStore, parseUserProfile } from './schemas'

type Emit = (session: Session) => void

const BLOCKED_MESSAGE = 'Akses Anda ke toko ini sudah dinonaktifkan. Hubungi pemilik toko.'
const BROKEN_MESSAGE = 'Data akun tidak lengkap. Hubungi pemilik toko atau pengembang.'

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName ?? '',
    email: user.email ?? '',
    photoURL: user.photoURL,
  }
}

function sessionError(user: AuthUser, error: unknown): Session {
  const message = errorCode(error) === 'permission-denied' ? BLOCKED_MESSAGE : describeError(error)
  return { status: 'error', message, user }
}

/** Langkah 3: pantau dokumen toko; perubahan nama toko langsung terlihat di semua HP. */
function watchStore(user: AuthUser, profile: UserProfile, emit: Emit): Unsubscribe {
  return onSnapshot(
    doc(db, 'stores', profile.storeId),
    (snapshot) => {
      const store = parseStore(snapshot.id, snapshot.data())
      emit(
        store
          ? { status: 'ready', user, profile, store }
          : { status: 'error', message: BROKEN_MESSAGE, user },
      )
    },
    (error) => {
      emit(sessionError(user, error))
    },
  )
}

/** Langkah 2: cari toko milik akun lewat `users/{uid}`. Tidak ada → akun baru, perlu buat toko. */
function watchProfile(user: AuthUser, emit: Emit): Unsubscribe {
  let stopStore: Unsubscribe | undefined

  const stopProfile = onSnapshot(
    doc(db, 'users', user.uid),
    (snapshot) => {
      stopStore?.()
      stopStore = undefined

      if (!snapshot.exists()) {
        // Dari cache saat offline, "tidak ada" belum tentu benar → tunggu jawaban server.
        emit(snapshot.metadata.fromCache ? { status: 'loading' } : { status: 'needsStore', user })
        return
      }
      const profile = parseUserProfile(snapshot.data())
      if (!profile) {
        emit({ status: 'error', message: BROKEN_MESSAGE, user })
        return
      }
      stopStore = watchStore(user, profile, emit)
    },
    (error) => {
      emit(sessionError(user, error))
    },
  )

  return () => {
    stopStore?.()
    stopProfile()
  }
}

/**
 * Memantau sesi: akun Google → profil (`users/{uid}`) → toko. Setiap perubahan dikirim ke `emit`.
 * Mengembalikan fungsi untuk berhenti memantau.
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
