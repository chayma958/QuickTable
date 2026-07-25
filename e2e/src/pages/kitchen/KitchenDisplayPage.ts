import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class KitchenDisplayPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/kitchen');
  }

  columnHeading(name: 'Incoming' | 'Preparing' | 'Ready') {
    return this.page.getByText(name, { exact: true });
  }

  orderNumberText(orderNumber: number) {
    return this.page.getByText(`#${orderNumber}`, { exact: true });
  }

  private card(orderNumber: number) {
    return this.page
      .getByText(`#${orderNumber}`, { exact: true })
      .locator('xpath=..')
      .locator('xpath=..');
  }

  async acceptOrder(orderNumber: number) {
    await this.card(orderNumber).getByRole('button', { name: 'Accept' }).click();
  }

  async startPreparing(orderNumber: number) {
    await this.card(orderNumber).getByRole('button', { name: 'Start preparing' }).click();
  }

  async markReady(orderNumber: number) {
    await this.card(orderNumber).getByRole('button', { name: 'Ready', exact: true }).click();
  }
}
