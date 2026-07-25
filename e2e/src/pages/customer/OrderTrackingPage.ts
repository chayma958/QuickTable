import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class OrderTrackingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForNavigation(timeout = 15000) {
    await this.page.waitForURL(/\/orders\/[^/]+\/track/, { timeout });
  }

  orderNumberHeading() {
    return this.page.getByText(/^Order #\d+$/);
  }

  async orderNumber(): Promise<number> {
    const text = await this.orderNumberHeading().textContent();
    return Number(text?.replace('Order #', ''));
  }

  stepLabel(label: string) {
    return this.page.getByText(label, { exact: true });
  }

  totalValue() {
    return this.page
      .getByText('Total', { exact: true })
      .locator('xpath=following-sibling::span[1]');
  }

  orderMoreLink() {
    return this.page.getByRole('link', { name: 'Order more from the menu' });
  }

  tableClosedMessage() {
    return this.page.getByText('This table has been closed.');
  }

  async waitForDelivered(timeout = 25000) {
    await this.page.getByText('Rate your order').waitFor({ timeout });
  }
}
