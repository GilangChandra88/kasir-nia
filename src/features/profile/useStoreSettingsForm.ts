import { useState } from 'react'
import { useNavigate } from 'react-router'

import { ROUTES } from '@/config/routes'
import { updateStoreProfile } from '@/data/storeRepo'
import {
  draftFromStore,
  type StoreProfileDraft,
  type StoreProfileErrors,
  validateStoreProfile,
} from '@/domain/storeProfile'
import type { StoreInfo } from '@/domain/types'
import { useAsyncAction } from '@/features/shared/useAsyncAction'
import { useToastStore } from '@/store/toastStore'

/** Status & aksi form "Toko & Struk". */
export function useStoreSettingsForm(store: StoreInfo) {
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.show)
  const [draft, setDraft] = useState<StoreProfileDraft>(() => draftFromStore(store))
  const [submitted, setSubmitted] = useState(false)

  const validation = validateStoreProfile(draft)
  const errors: StoreProfileErrors = submitted && !validation.ok ? validation.errors : {}

  const { run, pending, error } = useAsyncAction(async () => {
    if (!validation.ok) return
    await updateStoreProfile(store.id, validation.value)
    showToast('Info toko & struk disimpan')
    void navigate(ROUTES.profile)
  })

  return {
    draft,
    errors,
    /** Mengubah satu isian. */
    set: <K extends keyof StoreProfileDraft>(field: K, value: StoreProfileDraft[K]) => {
      setDraft((current) => ({ ...current, [field]: value }))
    },
    /** `false` bila masih ada isian salah. */
    submit: (): boolean => {
      setSubmitted(true)
      if (!validation.ok) {
        showToast('Periksa isian yang ditandai merah.', 'error')
        return false
      }
      void run()
      return true
    },
    pending,
    error,
  }
}
