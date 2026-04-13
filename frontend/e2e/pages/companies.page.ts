import { Page, Locator, expect } from '@playwright/test';

export class CompaniesPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly idInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly companiesTable: Locator;
  readonly companyRows: Locator;
  readonly companyLinks: Locator;
  readonly resultsHeader: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('#name');
    this.idInput = page.locator('#id');
    this.searchButton = page.locator('button.btn-primary', { hasText: 'Search' });
    this.resetButton = page.locator('button.btn-secondary', { hasText: 'Reset' });
    this.companiesTable = page.locator('.companies-table');
    this.companyRows = page.locator('.companies-table tbody tr');
    this.companyLinks = page.locator('.company-link');
    this.resultsHeader = page.locator('.results-header');
    this.emptyState = page.locator('.empty');
  }

  async navigate() {
    await this.page.goto('/companies');
    await this.waitForData();
  }

  async waitForData() {
    await expect(this.page.locator('.status-bar.loading')).toHaveCount(0, { timeout: 10000 });
  }

  async filterByName(name: string) {
    await this.nameInput.fill(name);
    await this.searchButton.click();
    await this.waitForData();
  }

  async getFirstCompanyLink(): Promise<Locator> {
    return this.companyLinks.first();
  }

  async clickFirstCompany() {
    await this.companyLinks.first().click();
  }

  async getTotalCount(): Promise<string> {
    const text = await this.resultsHeader.textContent();
    return text ?? '';
  }
}
