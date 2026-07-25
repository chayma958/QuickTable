import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class TablesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/dashboard/tables');
  }

  private card(number: number) {
    return this.page
      .getByText(`Table ${number}`, { exact: true })
      .locator('xpath=ancestor::div[.//select][1]');
  }

  async assignWaiter(number: number, waiterName: string | 'Unassigned') {
    await this.card(number).locator('select').selectOption({ label: waiterName });
  }
}
