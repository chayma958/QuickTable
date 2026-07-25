import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type DemoRoleLabel = 'Restaurant Owner' | 'Kitchen' | 'Waiter' | 'Platform Admin';

const DEMO_EMAILS: Record<DemoRoleLabel, string> = {
  'Restaurant Owner': 'owner@demo.com',
  Kitchen: 'kitchen@demo.com',
  Waiter: 'waiter@demo.com',
  'Platform Admin': 'admin@demo.com',
};

export class StaffLoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in', exact: true }).click();
  }

  async loginAsDemo(roleLabel: DemoRoleLabel) {
    const row = this.page
      .getByText(DEMO_EMAILS[roleLabel], { exact: true })
      .locator('xpath=ancestor::div[.//button[text()="Use Demo Account"]][1]');
    await row.getByRole('button', { name: 'Use Demo Account' }).click();
  }

  errorMessage() {
    return this.page.getByText('Invalid email or password');
  }
}
