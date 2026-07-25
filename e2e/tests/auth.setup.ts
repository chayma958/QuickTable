import { test as setup } from '@playwright/test';
import { StaffLoginPage, type DemoRoleLabel } from '../src/pages/StaffLoginPage';

const ROLES: Array<{ label: DemoRoleLabel; file: string }> = [
  { label: 'Restaurant Owner', file: 'playwright/.auth/owner.json' },
  { label: 'Kitchen', file: 'playwright/.auth/kitchen.json' },
  { label: 'Waiter', file: 'playwright/.auth/waiter.json' },
];

for (const role of ROLES) {
  setup(`authenticate as ${role.label}`, async ({ page }) => {
    const loginPage = new StaffLoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsDemo(role.label);
    await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15000 });
    await page.context().storageState({ path: role.file });
  });
}
