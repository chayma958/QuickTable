import type { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  header() {
    return this.page.locator('header').first();
  }

  cartIcon() {
    return this.page.getByRole('button', { name: 'Open cart' });
  }

  cartBadgeCount() {
    return this.cartIcon().locator('span');
  }

  restaurantProfileLink() {
    return this.page.getByRole('link', { name: 'View restaurant page' });
  }

  myOrdersLink() {
    return this.page.getByRole('link', { name: 'My orders' });
  }

  tableBadge(number: number) {
    return this.header().getByText(`Table ${number}`, { exact: true });
  }
}
