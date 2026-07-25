import { OwnerShell } from '@layouts/OwnerShell';
import { AcceptInvitationPage } from '@pages/auth/AcceptInvitationPage';
import { ForgotPasswordPage } from '@pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@pages/auth/ResetPasswordPage';
import { StaffLoginPage } from '@pages/auth/StaffLoginPage';
import { LandingPage } from '@pages/LandingPage';
import { CartPage } from '@pages/customer/CartPage';
import { CheckoutPage } from '@pages/customer/CheckoutPage';
import { MenuPage } from '@pages/customer/MenuPage';
import { MyOrdersPage } from '@pages/customer/MyOrdersPage';
import { OrderTrackingPage } from '@pages/customer/OrderTrackingPage';
import { QrScanDemoPage } from '@pages/customer/QrScanDemoPage';
import { RestaurantProfilePage } from '@pages/customer/RestaurantProfilePage';
import { AnalyticsPage } from '@pages/owner/AnalyticsPage';
import { AuditLogPage } from '@pages/owner/AuditLogPage';
import { CategoriesPage } from '@pages/owner/CategoriesPage';
import { CouponsPage } from '@pages/owner/CouponsPage';
import { DashboardOverviewPage } from '@pages/owner/DashboardOverviewPage';
import { EmployeesPage } from '@pages/owner/EmployeesPage';
import { MenuManagementPage } from '@pages/owner/MenuManagementPage';
import { OrdersPage } from '@pages/owner/OrdersPage';
import { SettingsPage } from '@pages/owner/SettingsPage';
import { TablesPage } from '@pages/owner/TablesPage';
import { KitchenDisplayPage } from '@pages/kitchen/KitchenDisplayPage';
import { WaiterPage } from '@pages/waiter/WaiterPage';
import { RestaurantsPage } from '@pages/super-admin/RestaurantsPage';
import { ScrollToTop } from './ScrollToTop';
import { StaffGuard } from './StaffGuard';
import { Navigate, createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    element: <ScrollToTop />,
    children: [{ path: '/', element: <LandingPage /> },
  { path: '/login', element: <StaffLoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password/:token', element: <ResetPasswordPage /> },
  { path: '/invitations/:token', element: <AcceptInvitationPage /> },
  { path: '/demo/customer', element: <QrScanDemoPage /> },

  { path: '/r/:slug/about', element: <RestaurantProfilePage /> },
  { path: '/r/:slug', element: <MenuPage /> },
  { path: '/r/:slug/table/:tableNumber', element: <MenuPage /> },
  { path: '/cart', element: <CartPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/orders', element: <MyOrdersPage /> },
  { path: '/orders/:id/track', element: <OrderTrackingPage /> },

  {
    path: '/dashboard',
    element: (
      <StaffGuard roles={['OWNER']}>
        <OwnerShell />
      </StaffGuard>
    ),
    children: [
      { index: true, element: <DashboardOverviewPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'menu', element: <MenuManagementPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'tables', element: <TablesPage /> },
      { path: 'coupons', element: <CouponsPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'activity', element: <AuditLogPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  {
    path: '/kitchen',
    element: (
      <StaffGuard roles={['KITCHEN']}>
        <KitchenDisplayPage />
      </StaffGuard>
    ),
  },

  {
    path: '/waiter',
    element: (
      <StaffGuard roles={['WAITER']}>
        <WaiterPage />
      </StaffGuard>
    ),
  },

  {
    path: '/admin',
    element: (
      <StaffGuard roles={['SUPER_ADMIN']}>
        <RestaurantsPage />
      </StaffGuard>
    ),
  },

  { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
