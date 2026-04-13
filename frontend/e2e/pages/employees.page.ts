import { Page, Locator, expect } from '@playwright/test';

const isEmployeesApiResponse = (url: string) => url.includes('localhost:8080/employees');

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
    await Promise.all([
      this.page.waitForResponse(
        resp => isEmployeesApiResponse(resp.url()) && resp.status() === 200,
        { timeout: 30000 },
      ),
      this.page.goto('/employees'),
    ]);
  }

  private async clickAndWait() {
    await Promise.all([
      this.page.waitForResponse(
        resp => isEmployeesApiResponse(resp.url()) && resp.status() === 200,
        { timeout: 30000 },
      ),
      this.searchButton.click(),
    ]);
  }

  async filterByFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
    await this.clickAndWait();
  }

  async filterByLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
    await this.clickAndWait();
  }

  async filterByCompanyId(companyId: string) {
    await this.companyIdInput.fill(companyId);
    await this.clickAndWait();
  }

  async submitSearch() {
    await this.clickAndWait();
  }

  async reset() {
    await Promise.all([
      this.page.waitForResponse(
        resp => isEmployeesApiResponse(resp.url()) && resp.status() === 200,
        { timeout: 30000 },
      ),
      this.resetButton.click(),
    ]);
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
