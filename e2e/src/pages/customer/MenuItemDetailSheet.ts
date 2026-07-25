import type { Page } from '@playwright/test';

export class MenuItemDetailSheet {
  constructor(private readonly page: Page) {}

  quantityLocator() {
    return this.page.locator('span').filter({ hasText: /^\d+$/ });
  }

  private stepperButtons() {
    return this.quantityLocator().locator('xpath=..').locator('button');
  }

  async quantity(): Promise<number> {
    return Number(await this.quantityLocator().textContent());
  }

  async increment(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.stepperButtons().nth(1).click();
    }
  }

  async decrement(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.stepperButtons().first().click();
    }
  }

  notesInput() {
    return this.page.getByLabel('Special instructions');
  }

  async addNotes(notes: string) {
    await this.notesInput().fill(notes);
  }

  addToCartButton() {
    return this.page.getByRole('button', { name: /Add to cart/ });
  }

  async addToCart() {
    await this.addToCartButton().click();
  }

  async close() {
    await this.page.getByRole('button', { name: 'Close' }).click();
  }
}
