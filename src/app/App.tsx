import { LazyMotion, MotionConfig } from 'motion/react'
import { RouterProvider } from 'react-router'

import { useSessionSync } from '@/features/auth/useSessionSync'

import { router } from './router'

// Fitur animasi lengkap (layout & drag) dimuat terpisah setelah halaman pertama tampil.
const loadMotionFeatures = () => import('./motionFeatures').then((module) => module.domMax)

export function App() {
  useSessionSync()

  return (
    // `strict` memastikan hanya komponen `m.*` (ringan) yang dipakai, bukan `motion.*` (bundle penuh).
    // `reducedMotion="user"` mematikan animasi gerak bila perangkat meminta "kurangi gerakan".
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </LazyMotion>
  )
}
