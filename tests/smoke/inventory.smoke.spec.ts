import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../src/pages/InventoryPage';

test('authenticated user lands on inventory page', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();

  await expect(page).toHaveURL(/inventory.html/);
  await expect(inventoryPage.title).toHaveText('Products');
});