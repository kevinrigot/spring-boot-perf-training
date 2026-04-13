import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { EmployeesPage } from '../pages/employees.page';

const { Given, When, Then } = createBdd();

let notedTotalCount = '';

Given('I am on the employees page', async ({ page }) => {
  const employeesPage = new EmployeesPage(page);
  await employeesPage.navigate();
});

Given('I note the total employee count', async ({ page }) => {
  const employeesPage = new EmployeesPage(page);
  notedTotalCount = await employeesPage.getTotalCount();
});

Then('the employees table should be visible', async ({ page }) => {
  const employeesPage = new EmployeesPage(page);
  await expect(employeesPage.employeesTable).toBeVisible();
});

Then('at least one employee row should be displayed', async ({ page }) => {
  const employeesPage = new EmployeesPage(page);
  await expect(employeesPage.employeeRows.first()).toBeVisible();
  const count = await employeesPage.getRowCount();
  expect(count).toBeGreaterThan(0);
});

Then('the results header should show the total count', async ({ page }) => {
  const employeesPage = new EmployeesPage(page);
  await expect(employeesPage.resultsHeader).toBeVisible();
  const text = await employeesPage.getTotalCount();
  expect(text).toMatch(/\d+/);
});

When('I filter employees by first name {string}', async ({ page }, firstName: string) => {
  const employeesPage = new EmployeesPage(page);
  await employeesPage.filterByFirstName(firstName);
});

When('I filter employees by last name {string}', async ({ page }, lastName: string) => {
  const employeesPage = new EmployeesPage(page);
  await employeesPage.filterByLastName(lastName);
});

When('I filter employees by company id {string}', async ({ page }, companyId: string) => {
  const employeesPage = new EmployeesPage(page);
  await employeesPage.filterByCompanyId(companyId);
});

When('I submit the employee search', async ({ page }) => {
  const employeesPage = new EmployeesPage(page);
  await employeesPage.submitSearch();
});

When('I reset the employee filters', async ({ page }) => {
  const employeesPage = new EmployeesPage(page);
  await employeesPage.reset();
});

Then('each visible employee row should contain {string} in the name column', async ({ page }, text: string) => {
  const employeesPage = new EmployeesPage(page);
  const names = await employeesPage.getAllNameTexts();
  expect(names.length).toBeGreaterThan(0);
  for (const name of names) {
    expect(name.toLowerCase()).toContain(text.toLowerCase());
  }
});

Then('the total count should be restored', async ({ page }) => {
  const employeesPage = new EmployeesPage(page);
  const currentCount = await employeesPage.getTotalCount();
  expect(currentCount).toBe(notedTotalCount);
});
