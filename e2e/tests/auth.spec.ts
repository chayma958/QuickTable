import { test, expect } from '../src/fixtures/test';
import type { DemoRoleLabel } from '../src/pages/StaffLoginPage';

const DEMO_ACCOUNTS: Array<{ label: DemoRoleLabel; expectedPath: string }> = [
  { label: 'Restaurant Owner', expectedPath: '/dashboard' },
  { label: 'Kitchen', expectedPath: '/kitchen' },
  { label: 'Waiter', expectedPath: '/waiter' },
  { label: 'Platform Admin', expectedPath: '/admin' },
];

test.describe('Staff authentication', () => {
  for (const account of DEMO_ACCOUNTS) {
    test(`${account.label} demo account logs in and lands on ${account.expectedPath}`, async ({
      page,
      loginPage,
    }) => {
      await loginPage.goto();
      await loginPage.loginAsDemo(account.label);

      await expect(page).toHaveURL(new RegExp(`${account.expectedPath}$`), { timeout: 15000 });
    });
  }

  test('invalid credentials shows an error and stays on the login page', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('owner@demo.com', 'not-the-right-password');

    await expect(loginPage.errorMessage()).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('an unauthenticated visit to a staff-only route redirects to login', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login$/);
  });

  test("a waiter's session cannot reach the owner-only dashboard", async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAsDemo('Waiter');
    await expect(page).toHaveURL(/\/waiter$/);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });
});
