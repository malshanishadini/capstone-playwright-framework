import { test, expect } from '../../../fixtures/index';
import { users, loginErrors } from '../../../test-data/users';

// Login tests must start logged out, so ignore the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

const negativeCases = [
  {
    name: 'locked out user',
    username: users.lockedOut.username,
    password: users.lockedOut.password,
    error: loginErrors.lockedOut,
  },
  {
    name: 'wrong password',
    username: users.standard.username,
    password: 'wrong_password',
    error: loginErrors.invalidCredentials,
  },
  {
    name: 'unknown user',
    username: 'nobody',
    password: 'secret_sauce',
    error: loginErrors.invalidCredentials,
  },
  {
    name: 'missing username',
    username: '',
    password: 'secret_sauce',
    error: loginErrors.usernameRequired,
  },
  {
    name: 'missing password',
    username: users.standard.username,
    password: '',
    error: loginErrors.passwordRequired,
  },
];

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid user can log in', { tag: '@smoke' }, async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  for (const { name, username, password, error } of negativeCases) {
    test(`rejects login: ${name}`, { tag: '@regression' }, async ({ page, loginPage }) => {
      await loginPage.login(username, password);

      await expect(loginPage.errorMessage).toHaveText(error);
      await expect(page).not.toHaveURL(/inventory.html/);
    });
  }

  test('user can log out', { tag: '@regression' }, async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
  });

  test('protected page redirects to login when logged out', { tag: '@regression' }, async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.errorMessage).toContainText('when you are logged in');
    await expect(loginPage.loginButton).toBeVisible();
  });
});