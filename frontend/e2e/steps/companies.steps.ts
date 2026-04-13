import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { CompaniesPage } from '../pages/companies.page';
import { CompanyDetailPage } from '../pages/company-detail.page';

const { Given, When, Then } = createBdd();

Given('I am on the companies page', async ({ page }) => {
  const companiesPage = new CompaniesPage(page);
  await companiesPage.navigate();
});

Then('the companies table should be visible', async ({ page }) => {
  const companiesPage = new CompaniesPage(page);
  await expect(companiesPage.companiesTable).toBeVisible();
});

Then('at least one company row should be displayed', async ({ page }) => {
  const companiesPage = new CompaniesPage(page);
  await expect(companiesPage.companyRows.first()).toBeVisible();
  const count = await companiesPage.companyRows.count();
  expect(count).toBeGreaterThan(0);
});

When('I click on the first company link', async ({ page }) => {
  const companiesPage = new CompaniesPage(page);
  await companiesPage.clickFirstCompany();
});

Then('I should be on the company detail page', async ({ page }) => {
  const detailPage = new CompanyDetailPage(page);
  await detailPage.waitForData();
  await expect(page).toHaveURL(/\/companies\/\d+/);
});

Then('the company name heading should be visible', async ({ page }) => {
  const detailPage = new CompanyDetailPage(page);
  await expect(detailPage.companyHeading).toBeVisible();
  const name = await detailPage.companyHeading.textContent();
  expect(name?.trim().length).toBeGreaterThan(0);
});

Then('the back link should be visible', async ({ page }) => {
  const detailPage = new CompanyDetailPage(page);
  await expect(detailPage.backLink).toBeVisible();
});

When('I filter companies by name {string}', async ({ page }, name: string) => {
  const companiesPage = new CompaniesPage(page);
  await companiesPage.filterByName(name);
});

Then('the departments section should be visible', async ({ page }) => {
  const detailPage = new CompanyDetailPage(page);
  await expect(detailPage.departmentsGrid.or(detailPage.emptyDepartments)).toBeVisible();
});
