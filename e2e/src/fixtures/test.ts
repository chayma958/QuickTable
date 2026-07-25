import { test as base } from '@playwright/test';
import { StaffLoginPage } from '../pages/StaffLoginPage';
import { MenuPage } from '../pages/customer/MenuPage';
import { MenuItemDetailSheet } from '../pages/customer/MenuItemDetailSheet';
import { CartPage } from '../pages/customer/CartPage';
import { CheckoutPage } from '../pages/customer/CheckoutPage';
import { OrderTrackingPage } from '../pages/customer/OrderTrackingPage';
import { MenuManagementPage } from '../pages/owner/MenuManagementPage';
import { MenuItemFormModal } from '../pages/owner/MenuItemFormModal';
import { TablesPage } from '../pages/owner/TablesPage';
import { KitchenDisplayPage } from '../pages/kitchen/KitchenDisplayPage';
import { WaiterDashboardPage } from '../pages/waiter/WaiterDashboardPage';
import { TableDetailModal } from '../pages/waiter/TableDetailModal';

interface Pages {
  loginPage: StaffLoginPage;
  menuPage: MenuPage;
  itemDetailSheet: MenuItemDetailSheet;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderTrackingPage: OrderTrackingPage;
  menuManagementPage: MenuManagementPage;
  menuItemFormModal: MenuItemFormModal;
  tablesPage: TablesPage;
  kitchenDisplayPage: KitchenDisplayPage;
  waiterDashboardPage: WaiterDashboardPage;
  tableDetailModal: TableDetailModal;
}

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new StaffLoginPage(page)),
  menuPage: async ({ page }, use) => use(new MenuPage(page)),
  itemDetailSheet: async ({ page }, use) => use(new MenuItemDetailSheet(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  orderTrackingPage: async ({ page }, use) => use(new OrderTrackingPage(page)),
  menuManagementPage: async ({ page }, use) => use(new MenuManagementPage(page)),
  menuItemFormModal: async ({ page }, use) => use(new MenuItemFormModal(page)),
  tablesPage: async ({ page }, use) => use(new TablesPage(page)),
  kitchenDisplayPage: async ({ page }, use) => use(new KitchenDisplayPage(page)),
  waiterDashboardPage: async ({ page }, use) => use(new WaiterDashboardPage(page)),
  tableDetailModal: async ({ page }, use) => use(new TableDetailModal(page)),
});

export { expect } from '@playwright/test';
