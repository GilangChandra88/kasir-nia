import { beforeEach, describe, expect, it } from 'vitest'

import { useCartStore } from './cartStore'

const cartOf = (storeId: string) => useCartStore.getState().carts[storeId]

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ carts: {} })
  })

  it('add menambah barang ke keranjang toko yang benar', () => {
    useCartStore.getState().add('t1', 'r', 'bks')
    useCartStore.getState().add('t1', 'r', 'bks')
    expect(cartOf('t1')).toEqual([{ productId: 'r', variantId: 'bks', qty: 2 }])
    expect(cartOf('t2')).toBeUndefined()
  })

  it('setQty mengubah jumlah dan 0 menghapus baris', () => {
    const { add, setQty } = useCartStore.getState()
    add('t1', 'r', 'bks')
    setQty('t1', 'r', 'bks', 5)
    expect(cartOf('t1')?.[0]?.qty).toBe(5)
    setQty('t1', 'r', 'bks', 0)
    expect(cartOf('t1')).toEqual([])
  })

  it('clear hanya mengosongkan toko itu', () => {
    const { add, clear } = useCartStore.getState()
    add('t1', 'r', 'bks')
    add('t2', 'x', 'y')
    clear('t1')
    expect(cartOf('t1')).toEqual([])
    expect(cartOf('t2')).toHaveLength(1)
  })

  it('clearAll mengosongkan semua keranjang', () => {
    useCartStore.getState().add('t1', 'r', 'bks')
    useCartStore.getState().clearAll()
    expect(useCartStore.getState().carts).toEqual({})
  })
})
