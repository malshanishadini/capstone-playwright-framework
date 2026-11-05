import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/helpers';

export class CheckoutOverviewPage extends BasePage {
  readonly itemNames: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async getSubtotal(): Promise<number> {
    return parsePrice((await this.subtotalLabel.textContent()) ?? '');
  }

  async getTax(): Promise<number> {
    return parsePrice((await this.taxLabel.textContent()) ?? '');
  }

  async getTotal(): Promise<number> {
    return parsePrice((await this.totalLabel.textContent()) ?? '');
  }

  async finish() {
    await this.finishButton.click();
  }
}