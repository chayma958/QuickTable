import type { Page } from '@playwright/test';

export interface MenuItemFormInput {
  category: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  prepTimeMinutes?: number;
  calories?: number;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  spicy?: boolean;
}

export class MenuItemFormModal {
  constructor(private readonly page: Page) {}

  categorySelect() {
    return this.page.locator('#mi-category');
  }

  nameInput() {
    return this.page.locator('#mi-name');
  }

  descriptionInput() {
    return this.page.locator('#mi-description');
  }

  priceInput() {
    return this.page.locator('#mi-price');
  }

  discountInput() {
    return this.page.locator('#mi-discount');
  }

  prepTimeInput() {
    return this.page.locator('#mi-prep');
  }

  caloriesInput() {
    return this.page.locator('#mi-calories');
  }

  async fill(input: MenuItemFormInput) {
    await this.categorySelect().selectOption({ label: input.category });
    await this.nameInput().fill(input.name);
    if (input.description) await this.descriptionInput().fill(input.description);
    await this.priceInput().fill(String(input.price));
    if (input.discountPrice != null) await this.discountInput().fill(String(input.discountPrice));
    if (input.prepTimeMinutes != null) await this.prepTimeInput().fill(String(input.prepTimeMinutes));
    if (input.calories != null) await this.caloriesInput().fill(String(input.calories));
    if (input.vegetarian) await this.page.getByLabel('Vegetarian').check();
    if (input.vegan) await this.page.getByLabel('Vegan').check();
    if (input.glutenFree) await this.page.getByLabel('Gluten-free').check();
    if (input.spicy) await this.page.getByLabel('Spicy').check();
  }

  submitButton() {
    return this.page.getByRole('button', { name: /Create item|Save changes/ });
  }

  async submit() {
    await this.submitButton().click();
  }

  async cancel() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }
}
