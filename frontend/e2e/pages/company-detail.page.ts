import { Page, Locator, expect } from '@playwright/test';

export class CompanyDetailPage {
  readonly page: Page;
  readonly backLink: Locator;
  readonly companyHeading: Locator;
  readonly companyId: Locator;
  readonly deptCount: Locator;
  readonly departmentsGrid: Locator;
  readonly deptCards: Locator;
  readonly emptyDepartments: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backLink = page.locator('.back-link');
    this.companyHeading = page.locator('.company-header h1');
    this.companyId = page.locator('.company-id');
    this.deptCount = page.locator('.dept-count');
    this.departmentsGrid = page.locator('.departments-grid');
    this.deptCards = page.locator('.dept-card');
    this.emptyDepartments = page.locator('text=This company has no departments');
  }

  async waitForData() {
    await expect(this.page.locator('.status-bar.loading')).toHaveCount(0, { timeout: 10000 });
  }

  async isOnDetailPage(): Promise<boolean> {
    return /\/companies\/\d+/.test(this.page.url());
  }

  async goBack() {
    await this.backLink.click();
    await expect(this.page).toHaveURL('/companies');
  }
}
