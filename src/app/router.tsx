import { createBrowserRouter, Navigate } from 'react-router'

import { ROUTES } from '@/config/routes'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CreateStorePage } from '@/pages/CreateStorePage'
import { HistoryPage } from '@/pages/HistoryPage'
import { InventoryPage } from '@/pages/InventoryPage'
import { LoginPage } from '@/pages/LoginPage'
import { ProductFormPage } from '@/pages/ProductFormPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { StoreSettingsPage } from '@/pages/StoreSettingsPage'

import { AppLayout } from './AppLayout'
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
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.checkout} replace /> },
          { path: ROUTES.checkout, element: <CheckoutPage /> },
          { path: ROUTES.history, element: <HistoryPage /> },
          { path: ROUTES.inventory, element: <InventoryPage /> },
          { path: ROUTES.inventoryNew, element: <ProductFormPage /> },
          { path: ROUTES.inventoryEdit, element: <ProductFormPage /> },
          { path: ROUTES.profile, element: <ProfilePage /> },
          { path: ROUTES.storeSettings, element: <StoreSettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
