// src/pages/BasePage.ts
// Base Page Class - Contains common methods shared across all page objects

import { Page } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string = "/") {
    await this.page.goto(path);
  }
}
