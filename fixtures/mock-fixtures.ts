import { test as base, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export interface MockRouteConfig {
  url: string | RegExp;
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
  method?: string;
}

export class MockHelper {
  constructor(private page: Page) {}

  async mockRoute(config: MockRouteConfig) {
    await this.page.route(config.url, async (route) => {
      if (config.method && route.request().method() !== config.method.toUpperCase()) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: config.status ?? 200,
        contentType: 'application/json',
        headers: config.headers,
        body: JSON.stringify(config.body ?? {}),
      });
    });
  }

  loadMockData<T>(fileName: string): T {
    const filePath = path.resolve(__dirname, '../test-data/mock-responses', fileName);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  }

  async blockRequests(pattern: string | RegExp) {
    await this.page.route(pattern, (route) => route.abort());
  }
}

export const test = base.extend<{ mockHelper: MockHelper }>({
  mockHelper: async ({ page }, use) => {
    await use(new MockHelper(page));
  },
});

export { expect } from '@playwright/test';