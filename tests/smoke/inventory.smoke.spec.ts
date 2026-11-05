import { test, expect } from '../../fixtures/index';

test('authenticated user lands on inventory page', async ({ page, inventoryPage }) => {
  await inventoryPage.goto();

  await expect(page).toHaveURL(/inventory.html/);
  await expect(inventoryPage.title).toHaveText('Products');
});