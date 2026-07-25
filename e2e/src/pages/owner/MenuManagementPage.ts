import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class MenuManagementPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/dashboard/menu');
  }

  addItemButton() {
    return this.page.getByRole('button', { name: '+ Add item' }).first();
  }

  async openCreateForm() {
    await this.addItemButton().click();
  }

  row(name: string) {
    return this.page
      .getByText(name, { exact: true })
      .locator('xpath=ancestor::div[.//button[text()="Edit"]][1]');
  }

  async editItem(name: string) {
    await this.row(name).getByRole('button', { name: 'Edit' }).click();
  }

  async deleteItem(name: string) {
    await this.row(name).getByRole('button', { name: 'Delete' }).click();
  }

  emptyStateTitle() {
    return this.page.getByText('No menu items yet');
  }
}
