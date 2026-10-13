import { beforeEach, describe, expect, it } from 'vitest'

import { useToastStore } from './toastStore'

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('show menambah toast dengan nada sukses bawaan', () => {
    useToastStore.getState().show('Barang disimpan')
    expect(useToastStore.getState().toasts).toMatchObject([
      { message: 'Barang disimpan', tone: 'success' },
    ])
  })

  it('hanya menyimpan tiga toast terbaru', () => {
    const { show } = useToastStore.getState()
    ;['a', 'b', 'c', 'd'].forEach((message) => {
      show(message, 'info')
    })
    expect(useToastStore.getState().toasts.map((toast) => toast.message)).toEqual(['b', 'c', 'd'])
  })

  it('dismiss menghapus toast sesuai id', () => {
    useToastStore.getState().show('a')
    useToastStore.getState().show('b', 'error')
    const [first] = useToastStore.getState().toasts
    useToastStore.getState().dismiss(first?.id ?? -1)
    expect(useToastStore.getState().toasts.map((toast) => toast.message)).toEqual(['b'])
  })
})
