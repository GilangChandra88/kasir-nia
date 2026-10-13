import { createBrowserRouter, Navigate } from 'react-router'

import { AppShell } from '@/components/layout/AppShell'
import { ROUTES } from '@/config/routes'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CreateStorePage } from '@/pages/CreateStorePage'
import { HistoryPage } from '@/pages/HistoryPage'
import { InventoryPage } from '@/pages/InventoryPage'
import { LoginPage } from '@/pages/LoginPage'
import { ProfilePage } from '@/pages/ProfilePage'

import { NAV_ITEMS } from './navigation'
import { SessionGate } from './SessionGate'

export const router = createBrowserRouter([
  {
    element: <SessionGate allow="signedOut" />,
    children: [{ path: ROUTES.login, element: <LoginPage /> }],
  },
  {
    element: <SessionGate allow="needsStore" />,
    children: [{ path: ROUTES.createStore, element: <CreateStorePage /> }],
  },
  {
    element: <SessionGate allow="ready" />,
    children: [
      {
        element: <AppShell navItems={NAV_ITEMS} />,
        children: [
          { index: true, element: <Navigate to={ROUTES.checkout} replace /> },
          { path: ROUTES.checkout, element: <CheckoutPage /> },
          { path: ROUTES.history, element: <HistoryPage /> },
          { path: ROUTES.inventory, element: <InventoryPage /> },
          { path: ROUTES.profile, element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
