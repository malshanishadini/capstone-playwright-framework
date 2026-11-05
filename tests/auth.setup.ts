import { test as setup } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

const STANDARD_USER_FILE = 'playwright/.auth/standard-user.json';

setup('authenticate as standard_user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await page.waitForURL('**/inventory.html');
  await page.context().storageState({ path: STANDARD_USER_FILE });
});