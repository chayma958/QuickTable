import { test, expect } from '../src/fixtures/test';
import { uniqueDishName } from '../src/helpers/test-data';

test.use({ storageState: 'playwright/.auth/owner.json' });

const RESTAURANT_SLUG = 'bella-italia';

test.describe('Owner menu management', () => {
  test('a newly created menu item appears in the live customer menu', async ({
    browser,
    menuManagementPage,
    menuItemFormModal,
  }) => {
    const dishName = uniqueDishName();

    await menuManagementPage.goto();
    await menuManagementPage.openCreateForm();
    await menuItemFormModal.fill({
      category: 'Desserts',
      name: dishName,
      description: 'Created by an automated E2E test.',
      price: 4.5,
    });
    await menuItemFormModal.submit();

    await expect(menuManagementPage.row(dishName)).toBeVisible();

    const customerContext = await browser.newContext();
    try {
      const customerPage = await customerContext.newPage();
      await customerPage.goto(`/r/${RESTAURANT_SLUG}`);
      await expect(customerPage.getByText(dishName, { exact: true })).toBeVisible({ timeout: 10000 });
    } finally {
      await customerContext.close();
    }

    await menuManagementPage.deleteItem(dishName);
    await expect(menuManagementPage.row(dishName)).toHaveCount(0);
  });
});
