import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class MenuPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(slug: string, tableNumber?: number) {
    const path = tableNumber ? `/r/${slug}/table/${tableNumber}` : `/r/${slug}`;
    await super.goto(path);
  }

  categoryTab(name: string) {
    return this.page.getByRole('button', { name, exact: true });
  }

  async selectCategory(name: string) {
    await this.categoryTab(name).click();
  }

  searchInput() {
    return this.page.getByPlaceholder('Search dishes...');
  }

  async search(query: string) {
    await this.searchInput().fill(query);
  }

  dietaryFilter(label: 'Vegetarian' | 'Vegan' | 'Gluten-free' | 'Spicy') {
    return this.page.getByRole('button', { name: label, exact: true });
  }

  categoryHeading(name: string) {
    return this.page.getByRole('heading', { name, exact: true });
  }

  itemCard(name: string) {
    return this.page
      .locator('[role="button"]')
      .filter({ has: this.page.getByText(name, { exact: true }) });
  }

  async openItem(name: string) {
    await this.itemCard(name).click();
  }

  quickAddButton(name: string) {
    return this.page.getByRole('button', { name: `Add ${name} to cart` });
  }

  async quickAdd(name: string) {
    await this.quickAddButton(name).click();
  }

  noResultsMessage() {
    return this.page.getByText('No dishes match your search');
  }
}
