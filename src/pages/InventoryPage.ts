import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async goto() {
    await super.goto('/inventory.html');
  }

  async addItemToCart(itemName: string) {
    const slug = itemName.toLowerCase().replace(/\s+/g, '-');
    await this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }
}