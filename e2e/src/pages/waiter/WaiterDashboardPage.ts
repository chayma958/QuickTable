import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class WaiterDashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/waiter');
  }

  async switchView(view: 'My Tables' | 'All Tables') {
    await this.page.getByRole('button', { name: view, exact: true }).click();
  }

  tableCard(number: number) {
    return this.page.getByRole('button', { name: new RegExp(`^Table ${number}\\b`) });
  }

  async openTable(number: number) {
    await this.tableCard(number).click();
  }

  notificationsHeading() {
    return this.page.getByRole('heading', { name: /Notifications/ });
  }

  notification(text: string | RegExp) {
    return this.page.getByRole('button', { name: text });
  }

  async openNotification(text: string | RegExp) {
    await this.notification(text).click();
  }
}
