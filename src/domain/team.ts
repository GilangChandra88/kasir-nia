import { MEMBER_NAME_MAX_LENGTH, MEMBER_NAME_MIN_LENGTH } from '@/config/limits'

import { normalizeText } from './product'
import type { Member } from './types'
import { definedOnly } from './validation'

export type InviteDraft = { email: string; displayName: string }

export type InviteErrors = Partial<Record<keyof InviteDraft, string>>

export type InviteValidation =
  { ok: true; value: InviteDraft } | { ok: false; errors: InviteErrors }

type InviteContext = {
  /** Email yang sudah jadi anggota atau sudah diundang di toko ini (huruf kecil). */
  takenEmails: string[]
}

/** Bentuk email sederhana: ada teks@teks.teks tanpa spasi. Kepastian akhirnya: login Google. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Email dibandingkan tanpa beda huruf besar/kecil dan tanpa spasi di tepi. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function emailError(email: string, { takenEmails }: InviteContext): string | undefined {
  if (email === '') return 'Email wajib diisi.'
  if (!EMAIL_PATTERN.test(email)) return 'Format email belum benar, mis. sari@gmail.com.'
  if (takenEmails.includes(email))
    return 'Email ini sudah terdaftar atau sudah diundang di toko ini.'
  return undefined
}

function nameError(name: string): string | undefined {
  if (name.length < MEMBER_NAME_MIN_LENGTH)
    return `Nama panggilan minimal ${MEMBER_NAME_MIN_LENGTH} huruf.`
  if (name.length > MEMBER_NAME_MAX_LENGTH)
    return `Nama panggilan maksimal ${MEMBER_NAME_MAX_LENGTH} huruf.`
  return undefined
}

/** Memeriksa isian "Tambah kasir". Email dinormalkan ke huruf kecil. */
export function validateInvite(draft: InviteDraft, context: InviteContext): InviteValidation {
  const email = normalizeEmail(draft.email)
  const displayName = normalizeText(draft.displayName)
  const errors = definedOnly({
    email: emailError(email, context),
    displayName: nameError(displayName),
  })
  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, value: { email, displayName } }
}

/** Urutan tampil: pemilik, kasir aktif (A–Z), lalu kasir nonaktif. */
export function sortMembers(members: Member[]): Member[] {
  const rank = (member: Member) => (member.role === 'owner' ? 0 : member.isActive ? 1 : 2)
  return [...members].sort(
    (a, b) => rank(a) - rank(b) || a.displayName.localeCompare(b.displayName, 'id'),
  )
}
