import { test, expect } from '../src/fixtures/test';
import { uniqueCustomerName, uniquePhone } from '../src/helpers/test-data';

const RESTAURANT_SLUG = 'bella-italia';
const TABLE_NUMBER = 2;

test.describe('Customer ordering journey', () => {
  test('browse, filter, add to cart, check out, and track a real order', async ({
    page,
    menuPage,
    itemDetailSheet,
    cartPage,
    checkoutPage,
    orderTrackingPage,
  }) => {
    await menuPage.goto(RESTAURANT_SLUG, TABLE_NUMBER);
    await expect(menuPage.header()).toContainText('Bella Italia');
    await expect(menuPage.tableBadge(TABLE_NUMBER)).toBeVisible();

    // Category filtering
    await menuPage.selectCategory('Pizza');
    await expect(menuPage.categoryHeading('Pizza')).toBeVisible();
    await expect(menuPage.itemCard('Margherita')).toBeVisible();

    // Dietary filtering narrows the same category further
    await menuPage.dietaryFilter('Vegetarian').click();
    await expect(menuPage.itemCard('Margherita')).toBeVisible();
    await expect(menuPage.itemCard('Pepperoni')).toHaveCount(0);
    await menuPage.dietaryFilter('Vegetarian').click(); // toggle back off

    // Search across all categories
    await menuPage.selectCategory('All');
    await menuPage.search('Tiramisu');
    await expect(menuPage.itemCard('Tiramisu')).toBeVisible();
    await expect(menuPage.itemCard('Margherita')).toHaveCount(0);
    await menuPage.search('');

    // Open a dish, customize quantity and notes, add to cart
    await menuPage.openItem('Margherita');
    await itemDetailSheet.increment(); // 1 -> 2
    await expect(itemDetailSheet.quantityLocator()).toHaveText('2');
    await itemDetailSheet.addNotes('no basil please');
    await itemDetailSheet.addToCart();

    await expect(menuPage.cartBadgeCount()).toHaveText('2');

    // Cart
    await menuPage.cartIcon().click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(cartPage.heading()).toBeVisible();
    await expect(cartPage.lineItem('Margherita')).toBeVisible();
    await expect(cartPage.subtotalValue()).toHaveText('$25.00');

    // Checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout$/);
    await checkoutPage.fillDetails({ name: uniqueCustomerName(), phone: uniquePhone() });
    await checkoutPage.placeOrder();

    // Order tracking reflects what was just ordered
    await orderTrackingPage.waitForNavigation();
    await expect(orderTrackingPage.orderNumberHeading()).toBeVisible();
    const orderNumber = await orderTrackingPage.orderNumber();
    expect(orderNumber).toBeGreaterThan(0);
    await expect(page.getByText('2x').first()).toBeVisible();
    await expect(page.getByText('Margherita').first()).toBeVisible();
    await expect(orderTrackingPage.totalValue()).toHaveText(/^\$\d+\.\d{2}$/);
    await expect(orderTrackingPage.stepLabel('Order received')).toBeVisible();
  });
});
