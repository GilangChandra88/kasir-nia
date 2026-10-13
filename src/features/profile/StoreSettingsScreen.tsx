import { Navigate } from 'react-router'

import { PageHeader } from '@/components/layout/PageHeader'
import { ROUTES } from '@/config/routes'
import { can } from '@/domain/permissions'
import { useReadySession } from '@/features/auth/useReadySession'

import { StoreSettingsForm } from './StoreSettingsForm'

/** Halaman "Toko & Struk" (`/profil/toko`). Khusus pemilik. */
export function StoreSettingsScreen() {
  const { profile, store } = useReadySession()
  if (!can(profile.role, 'manageStore')) return <Navigate to={ROUTES.profile} replace />

  return (
    <>
      <PageHeader title="Toko & Struk" subtitle="Profil" backTo={ROUTES.profile} />
      {/* key: bila data toko berubah dari HP lain sebelum form dibuka ulang, isi ikut segar. */}
      <StoreSettingsForm key={store.id} store={store} />
    </>
  )
}
