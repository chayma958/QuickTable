import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  nameInput() {
    return this.page.locator('#customerName');
  }

  phoneInput() {
    return this.page.locator('#customerPhone');
  }

  couponInput() {
    return this.page.locator('#couponCode');
  }

  notesInput() {
    return this.page.locator('#notes');
  }

  async fillDetails({ name, phone }: { name: string; phone: string }) {
    await this.nameInput().fill(name);
    await this.phoneInput().fill(phone);
  }

  placeOrderButton() {
    return this.page.getByRole('button', { name: 'Place order' });
  }

  async placeOrder() {
    await this.placeOrderButton().click();
  }

  serverError() {
    return this.page.getByText(/something went wrong|invalid/i);
  }
}
