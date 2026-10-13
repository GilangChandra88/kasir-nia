import { signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth'

import { errorCode } from './errors'
import { auth, googleProvider } from './firebase'

/** Popup lebih mulus di Chrome Android; redirect hanya cadangan bila popup diblokir. */
export async function signInWithGoogle(): Promise<void> {
  try {
    await signInWithPopup(auth, googleProvider)
  } catch (error) {
    if (errorCode(error) === 'auth/popup-blocked') {
      await signInWithRedirect(auth, googleProvider)
      return
    }
    throw error
  }
}

export function signOutUser(): Promise<void> {
  return signOut(auth)
}
