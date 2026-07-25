import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/cart');
  }

  emptyMessage() {
    return this.page.getByText('Your cart is empty.');
  }

  heading() {
    return this.page.getByRole('heading', { name: 'Your order' });
  }

  lineItem(name: string) {
    return this.page.getByText(name, { exact: true });
  }

  subtotalValue() {
    return this.page
      .getByText('Subtotal', { exact: true })
      .locator('xpath=following-sibling::span[1]');
  }

  proceedToCheckoutButton() {
    return this.page.getByRole('button', { name: 'Proceed to checkout' });
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton().click();
  }
}
