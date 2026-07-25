import { test, expect } from '../src/fixtures/test';
import { uniqueCustomerName, uniquePhone } from '../src/helpers/test-data';
import { KitchenDisplayPage } from '../src/pages/kitchen/KitchenDisplayPage';
import { WaiterDashboardPage } from '../src/pages/waiter/WaiterDashboardPage';
import { TableDetailModal } from '../src/pages/waiter/TableDetailModal';
import { TablesPage } from '../src/pages/owner/TablesPage';

const RESTAURANT_SLUG = 'bella-italia';
const TABLE_NUMBER = 3;

test.describe('Realtime order lifecycle across customer, kitchen, and waiter', () => {
  test('an order placed by a customer is seen live by kitchen and waiter through to delivery', async ({
    browser,
    menuPage,
    itemDetailSheet,
    cartPage,
    checkoutPage,
    orderTrackingPage,
  }) => {
    test.setTimeout(90_000);

    const ownerContext = await browser.newContext({ storageState: 'playwright/.auth/owner.json' });
    const kitchenContext = await browser.newContext({ storageState: 'playwright/.auth/kitchen.json' });
    const waiterContext = await browser.newContext({ storageState: 'playwright/.auth/waiter.json' });

    try {
      const ownerPage = await ownerContext.newPage();
      const tablesPage = new TablesPage(ownerPage);
      await tablesPage.goto();
      await tablesPage.assignWaiter(TABLE_NUMBER, 'Unassigned');
      await ownerContext.close();

      const kitchenPage = await kitchenContext.newPage();
      const waiterPage = await waiterContext.newPage();
      const kitchenDisplay = new KitchenDisplayPage(kitchenPage);
      const waiterDashboard = new WaiterDashboardPage(waiterPage);
      const tableDetail = new TableDetailModal(waiterPage);

      // Kitchen and waiter are already watching before the order exists.
      await kitchenDisplay.goto();
      await waiterDashboard.goto();
      await waiterDashboard.switchView('All Tables'); // table 3 is now unassigned, so hidden from "My Tables"

      // Customer places a single-item order.
      await menuPage.goto(RESTAURANT_SLUG, TABLE_NUMBER);
      await menuPage.openItem('Coca-Cola');
      await itemDetailSheet.addToCart();
      await menuPage.cartIcon().click();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillDetails({ name: uniqueCustomerName(), phone: uniquePhone() });
      await checkoutPage.placeOrder();
      await orderTrackingPage.waitForNavigation();
      const orderNumber = await orderTrackingPage.orderNumber();

      // Kitchen sees it arrive live — no reload — and walks it to Ready.
      await expect(kitchenDisplay.orderNumberText(orderNumber)).toBeVisible({ timeout: 20000 });
      await kitchenDisplay.acceptOrder(orderNumber);
      await kitchenDisplay.startPreparing(orderNumber);
      await kitchenDisplay.markReady(orderNumber);

      // Waiter sees the "ready" notification live, then marks it served.
      await expect(
        waiterDashboard.notification(new RegExp(`Order #${orderNumber} is ready for Table ${TABLE_NUMBER}`)),
      ).toBeVisible({ timeout: 20000 });
      await waiterDashboard.openTable(TABLE_NUMBER);
      await tableDetail.markServed();
      await tableDetail.close();

      // Customer's already-open tracking page reflects delivery live.
      await orderTrackingPage.waitForDelivered();
      await expect(orderTrackingPage.stepLabel('Served')).toBeVisible();
    } finally {
      await kitchenContext.close();
      await waiterContext.close();
    }
  });
});
