import { test, expect } from '../../../fixtures/index';
import { products, TOTAL_PRODUCTS } from '../../../test-data/products';

const sortCases = [
  { option: 'az', label: 'name A to Z', firstItem: products.backpack.name },
  { option: 'za', label: 'name Z to A', firstItem: products.redTShirt.name },
  { option: 'lohi', label: 'price low to high', firstItem: products.onesie.name },
  { option: 'hilo', label: 'price high to low', firstItem: products.fleeceJacket.name },
] as const;

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test.describe('product list', () => {
    test('shows all products', { tag: '@smoke' }, async ({ inventoryPage }) => {
      await expect(inventoryPage.inventoryItems).toHaveCount(TOTAL_PRODUCTS);
    });

    test('each product shows its expected name and price', { tag: '@regression' }, async ({ inventoryPage }) => {
      for (const product of Object.values(products)) {
        const item = inventoryPage.inventoryItems.filter({ hasText: product.name });
        await expect(item).toContainText(`$${product.price}`);
      }
    });
  });

  test.describe('sorting', () => {
    for (const { option, label, firstItem } of sortCases) {
      test(`sorts by ${label}`, { tag: '@regression' }, async ({ inventoryPage }) => {
        await inventoryPage.sortBy(option);

        const names = await inventoryPage.getItemNames();
        const prices = await inventoryPage.getItemPrices();

        expect(names[0]).toBe(firstItem);

        if (option === 'az') expect(names).toEqual([...names].sort());
        if (option === 'za') expect(names).toEqual([...names].sort().reverse());
        if (option === 'lohi') expect(prices).toEqual([...prices].sort((a, b) => a - b));
        if (option === 'hilo') expect(prices).toEqual([...prices].sort((a, b) => b - a));
      });
    }
  });

  test.describe('cart interactions', () => {
    test('adding an item updates the badge and button', { tag: '@smoke' }, async ({ inventoryPage }) => {
      await inventoryPage.addItemToCart(products.backpack.name);

      await expect(inventoryPage.cartBadge).toHaveText('1');
      await expect(inventoryPage.removeButton(products.backpack.name)).toBeVisible();
      await expect(inventoryPage.addToCartButton(products.backpack.name)).toBeHidden();
    });

    test('adding several items increases the badge count', { tag: '@regression' }, async ({ inventoryPage }) => {
      await inventoryPage.addItemToCart(products.backpack.name);
      await inventoryPage.addItemToCart(products.bikeLight.name);
      await inventoryPage.addItemToCart(products.onesie.name);

      await expect(inventoryPage.cartBadge).toHaveText('3');
    });

    test('removing the only item clears the badge', { tag: '@regression' }, async ({ inventoryPage }) => {
      await inventoryPage.addItemToCart(products.backpack.name);
      await inventoryPage.removeItemFromCart(products.backpack.name);

      await expect(inventoryPage.cartBadge).toBeHidden();
      await expect(inventoryPage.addToCartButton(products.backpack.name)).toBeVisible();
    });

    test('removing one of two items lowers the badge to 1', { tag: '@regression' }, async ({ inventoryPage }) => {
      await inventoryPage.addItemToCart(products.backpack.name);
      await inventoryPage.addItemToCart(products.bikeLight.name);
      await inventoryPage.removeItemFromCart(products.backpack.name);

      await expect(inventoryPage.cartBadge).toHaveText('1');
    });

    test('cart contents persist after a page reload', { tag: '@regression' }, async ({ page, inventoryPage }) => {
      await inventoryPage.addItemToCart(products.fleeceJacket.name);
      await page.reload();

      await expect(inventoryPage.cartBadge).toHaveText('1');
      await expect(inventoryPage.removeButton(products.fleeceJacket.name)).toBeVisible();
    });

    test('cart icon opens the cart page', { tag: '@regression' }, async ({ page, inventoryPage }) => {
      await inventoryPage.openCart();

      await expect(page).toHaveURL(/cart.html/);
    });
  });
});