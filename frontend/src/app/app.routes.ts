import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'companies', pathMatch: 'full' },
  {
    path: 'companies',
    loadComponent: () =>
      import('./companies/companies.component').then(m => m.CompaniesComponent),
  },
  {
    path: 'companies/:id',
    loadComponent: () =>
      import('./company-detail/company-detail.component').then(
        m => m.CompanyDetailComponent,
      ),
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./employees/employees.component').then(m => m.EmployeesComponent),
  },
];
