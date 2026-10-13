import * as m from 'motion/react-m'

import { PageHeader } from '@/components/layout/PageHeader'
import { fadeUpItem, staggerContainer } from '@/components/motion/variants'
import { useReadySession } from '@/features/auth/useReadySession'

import { AccountCard } from './AccountCard'
import { SignOutButton } from './SignOutButton'
import { StoreCard } from './StoreCard'
import { UpcomingSettingsCard } from './UpcomingSettingsCard'

export function ProfileScreen() {
  const { user, profile, store } = useReadySession()

  return (
    <>
      <PageHeader title="Profil" subtitle={store.name} />
      <m.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4"
      >
        <m.div variants={fadeUpItem}>
          <AccountCard user={user} role={profile.role} />
        </m.div>
        <m.div variants={fadeUpItem}>
          <StoreCard store={store} />
        </m.div>
        <m.div variants={fadeUpItem}>
          <UpcomingSettingsCard role={profile.role} />
        </m.div>
        <m.div variants={fadeUpItem} className="pt-2">
          <SignOutButton />
          <p className="mt-4 text-center text-xs text-muted">Nia Kasir versi {__APP_VERSION__}</p>
        </m.div>
      </m.div>
    </>
  )
}
