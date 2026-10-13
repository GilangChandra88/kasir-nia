import type { Role } from './types'

/** Hal yang dibatasi per peran. Aturan yang sama ditegakkan ulang di firestore.rules. */
export type Permission =
  'checkout' | 'viewInventory' | 'manageInventory' | 'viewAllSales' | 'manageStore' | 'manageTeam'

const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  owner: new Set([
    'checkout',
    'viewInventory',
    'manageInventory',
    'viewAllSales',
    'manageStore',
    'manageTeam',
  ]),
  cashier: new Set(['checkout', 'viewInventory']),
}

/** Satu sumber kebenaran untuk UI: boleh tidaknya peran ini melakukan sesuatu. */
export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission)
}
