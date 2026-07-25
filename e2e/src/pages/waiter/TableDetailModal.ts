import type { Page } from '@playwright/test';

export class TableDetailModal {
  constructor(private readonly page: Page) {}

  title(number: number) {
    return this.page.getByText(`Table ${number}`, { exact: true });
  }

  resolveRequestButton() {
    return this.page.getByRole('button', { name: 'Resolve' });
  }

  acknowledgeNoteButton() {
    return this.page.getByRole('button', { name: 'Acknowledge' });
  }

  cancelOrderButton() {
    return this.page.getByRole('button', { name: 'Cancel order', exact: true });
  }

  markServedButton() {
    return this.page.getByRole('button', { name: 'Mark food as served' });
  }

  acceptCashButton() {
    return this.page.getByRole('button', { name: 'Accept cash payment' });
  }

  doneButton() {
    return this.page.getByRole('button', { name: 'Done' });
  }

  async markServed() {
    await this.markServedButton().click();
  }

  async acceptCashPayment() {
    await this.acceptCashButton().click();
  }

  async cancelOrderWithConfirm() {
    await this.cancelOrderButton().click();
    await this.page.getByRole('button', { name: 'Cancel order', exact: true }).last().click();
  }

  async resolveRequest() {
    await this.resolveRequestButton().click();
  }

  async acknowledgeNote() {
    await this.acknowledgeNoteButton().click();
  }

  async close() {
    await this.doneButton().click();
  }
}
