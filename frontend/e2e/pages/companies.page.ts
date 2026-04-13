import { Page, Locator, expect } from '@playwright/test';

const isCompaniesApiResponse = (url: string) =>
  url.includes('localhost:8080/companies') && !url.includes('/companies/');

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
    await Promise.all([
      this.page.waitForResponse(
        resp => isCompaniesApiResponse(resp.url()) && resp.status() === 200,
        { timeout: 30000 },
      ),
      this.page.goto('/companies'),
    ]);
  }

  async filterByName(name: string) {
    await this.nameInput.fill(name);
    await Promise.all([
      this.page.waitForResponse(
        resp => isCompaniesApiResponse(resp.url()) && resp.status() === 200,
        { timeout: 30000 },
      ),
      this.searchButton.click(),
    ]);
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
