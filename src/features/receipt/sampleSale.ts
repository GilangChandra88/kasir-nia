import type { ReceiptSale } from '@/domain/receipt'

/** Transaksi contoh untuk pratinjau struk di pengaturan (tanggal tetap agar render tetap murni). */
export const SAMPLE_RECEIPT_SALE: ReceiptSale = {
  receiptNo: '261014-CNTH',
  date: new Date(2026, 9, 14, 9, 30),
  cashierName: 'Kasir',
  items: [
    {
      productId: 'contoh-1',
      variantId: 'a',
      name: 'Rokok Merk A',
      variantLabel: '1 bungkus',
      price: 30000,
      qty: 1,
      baseQty: 20,
    },
    {
      productId: 'contoh-2',
      variantId: 'b',
      name: 'Teh Botol 350ml',
      variantLabel: '1 botol',
      price: 5000,
      qty: 2,
      baseQty: 1,
    },
  ],
  total: 40000,
  itemCount: 3,
  cashReceived: 50000,
  change: 10000,
}
