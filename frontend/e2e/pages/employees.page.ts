import { Page, Locator, expect } from '@playwright/test';

export class EmployeesPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly idInput: Locator;
  readonly departmentIdInput: Locator;
  readonly companyIdInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly employeesTable: Locator;
  readonly employeeRows: Locator;
  readonly nameColumn: Locator;
  readonly resultsHeader: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.idInput = page.locator('#id');
    this.departmentIdInput = page.locator('#departmentId');
    this.companyIdInput = page.locator('#companyId');
    this.searchButton = page.locator('button.btn-primary', { hasText: 'Search' });
    this.resetButton = page.locator('button.btn-secondary', { hasText: 'Reset' });
    this.employeesTable = page.locator('.employees-table');
    this.employeeRows = page.locator('.employees-table tbody tr');
    this.nameColumn = page.locator('.employees-table tbody tr .col-name');
    this.resultsHeader = page.locator('.results-header');
    this.emptyState = page.locator('.empty');
  }

  async navigate() {
    await this.page.goto('/employees');
    await this.waitForData();
  }

  async waitForData() {
    await expect(this.page.locator('.status-bar.loading')).toHaveCount(0, { timeout: 30000 });
  }

  async filterByFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
    await this.searchButton.click();
    await this.waitForData();
  }

  async filterByLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
    await this.searchButton.click();
    await this.waitForData();
  }

  async filterByCompanyId(companyId: string) {
    await this.companyIdInput.fill(companyId);
    await this.searchButton.click();
    await this.waitForData();
  }

  async submitSearch() {
    await this.searchButton.click();
    await this.waitForData();
  }

  async reset() {
    await this.resetButton.click();
    await this.waitForData();
  }

  async getTotalCount(): Promise<string> {
    const text = await this.resultsHeader.textContent();
    return text ?? '';
  }

  async getRowCount(): Promise<number> {
    return this.employeeRows.count();
  }

  async getAllNameTexts(): Promise<string[]> {
    return this.nameColumn.allTextContents();
  }
}
