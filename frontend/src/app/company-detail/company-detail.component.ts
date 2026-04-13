import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { CompaniesService } from '../api';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <a routerLink="/companies" class="back-link">‹ Back to companies</a>

      @if (companyResource.isLoading()) {
        <div class="status-bar loading">Loading company details...</div>
      }

      @if (companyResource.error()) {
        <div class="status-bar error">
          Failed to load company. Make sure the backend is running on
          <code>http://localhost:8080</code>.
        </div>
      }

      @if (company(); as c) {
        <header class="company-header">
          <span class="company-id">#{{ c.id }}</span>
          <h1>{{ c.name }}</h1>
          <span class="dept-count">
            {{ c.departments?.length ?? 0 }}
            {{ (c.departments?.length ?? 0) === 1 ? 'department' : 'departments' }}
          </span>
        </header>

        @if (!c.departments || c.departments.length === 0) {
          <div class="empty">This company has no departments.</div>
        } @else {
          <div class="departments-grid">
            @for (dept of c.departments; track dept.id) {
              <div class="dept-card">
                <div class="dept-header">
                  <h2 class="dept-name">{{ dept.name }}</h2>
                  @if (dept.chief) {
                    <span class="dept-chief">
                      Chief: {{ dept.chief.firstName }} {{ dept.chief.lastName }}
                    </span>
                  }
                </div>

                @if (dept.employees && dept.employees.length > 0) {
                  <ul class="employee-list">
                    @for (emp of dept.employees; track emp.id) {
                      <li class="employee-row">
                        <span class="employee-name">
                          {{ emp.firstName }} {{ emp.lastName }}
                        </span>
                        @if (emp.userId) {
                          <span class="employee-id">{{ emp.userId }}</span>
                        }
                      </li>
                    }
                  </ul>
                } @else {
                  <p class="no-employees">No employees</p>
                }

                <div class="dept-footer">
                  {{ dept.employees?.length ?? 0 }}
                  {{ (dept.employees?.length ?? 0) === 1 ? 'employee' : 'employees' }}
                </div>
              </div>
            }
          </div>
        }
      } @else if (!companyResource.isLoading() && !companyResource.error()) {
        <div class="status-bar error">Company not found.</div>
      }
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 1100px;
        margin: 0 auto;
        padding: 2rem 1.5rem;
        font-family: system-ui, sans-serif;
      }

      .back-link {
        display: inline-block;
        color: #4361ee;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 1.5rem;
      }

      .back-link:hover {
        text-decoration: underline;
      }

      /* Status bars */
      .status-bar {
        padding: 0.75rem 1rem;
        border-radius: 6px;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }

      .status-bar.loading {
        background: #e8f4fd;
        color: #1565c0;
        border-left: 3px solid #1976d2;
      }

      .status-bar.error {
        background: #fdecea;
        color: #b71c1c;
        border-left: 3px solid #e53935;
      }

      /* Company header */
      .company-header {
        display: flex;
        align-items: baseline;
        gap: 0.75rem;
        margin-bottom: 1.75rem;
        flex-wrap: wrap;
      }

      .company-header h1 {
        font-size: 1.8rem;
        font-weight: 700;
        color: #1a1a2e;
        margin: 0;
      }

      .company-id {
        font-size: 0.85rem;
        color: #aaa;
        font-family: monospace;
      }

      .dept-count {
        font-size: 0.85rem;
        color: #666;
        background: #eef2ff;
        border: 1px solid #c7d2fe;
        border-radius: 20px;
        padding: 0.15rem 0.7rem;
        margin-left: auto;
      }

      .empty {
        text-align: center;
        padding: 2.5rem;
        color: #888;
        font-size: 1rem;
        background: #fafafa;
        border: 1px dashed #ddd;
        border-radius: 8px;
      }

      /* Departments grid */
      .departments-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.25rem;
      }

      .dept-card {
        background: #fff;
        border: 1px solid #e8e8e8;
        border-radius: 10px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .dept-header {
        background: #1a1a2e;
        color: #fff;
        padding: 0.85rem 1rem;
      }

      .dept-name {
        font-size: 1rem;
        font-weight: 700;
        margin: 0 0 0.2rem;
      }

      .dept-chief {
        font-size: 0.8rem;
        color: #a5b4fc;
      }

      /* Employee list */
      .employee-list {
        list-style: none;
        margin: 0;
        padding: 0.5rem 0;
        flex: 1;
      }

      .employee-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.45rem 1rem;
        font-size: 0.88rem;
        border-bottom: 1px solid #f5f5f5;
      }

      .employee-row:last-child {
        border-bottom: none;
      }

      .employee-name {
        color: #333;
      }

      .employee-id {
        font-size: 0.78rem;
        color: #999;
        font-family: monospace;
        background: #f5f5f5;
        padding: 0.1rem 0.4rem;
        border-radius: 3px;
      }

      .no-employees {
        padding: 0.75rem 1rem;
        color: #aaa;
        font-size: 0.85rem;
        font-style: italic;
        margin: 0;
        flex: 1;
      }

      .dept-footer {
        padding: 0.45rem 1rem;
        font-size: 0.78rem;
        color: #999;
        background: #fafafa;
        border-top: 1px solid #f0f0f0;
        text-align: right;
      }
    `,
  ],
})
export class CompanyDetailComponent {
  // Route param bound automatically via withComponentInputBinding()
  readonly id = input.required<string>();

  private readonly companiesService = inject(CompaniesService);

  readonly companyResource = rxResource({
    params: () => ({ id: Number(this.id()) }),
    stream: ({ params }) =>
      this.companiesService.searchCompaniesDetails(params.id, undefined, 0, 1),
  });

  readonly company = computed(() => this.companyResource.value()?.items[0]);
}
