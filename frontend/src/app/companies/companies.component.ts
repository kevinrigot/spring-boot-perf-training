import { Component, computed, effect, inject, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { CompaniesService } from '../api';

interface SearchParams {
  id: number | undefined;
  name: string | undefined;
  page: number;
  size: number;
}

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      <h1>Companies</h1>

      <!-- Filter form (signal forms via FormGroup + toSignal) -->
      <form [formGroup]="form" (ngSubmit)="search()" class="filter-form">
        <div class="filter-row">
          <div class="filter-field">
            <label for="id">ID</label>
            <input
              id="id"
              type="number"
              formControlName="id"
              placeholder="Filter by exact ID"
              min="1"
            />
          </div>

          <div class="filter-field">
            <label for="name">Name</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              placeholder="Filter by name (contains)"
            />
          </div>

          <div class="filter-field">
            <label for="size">Page size</label>
            <select id="size" formControlName="size">
              <option [value]="10">10</option>
              <option [value]="20">20</option>
              <option [value]="50">50</option>
              <option [value]="100">100</option>
            </select>
          </div>
        </div>

        <div class="filter-actions">
          <button type="submit" class="btn btn-primary">Search</button>
          <button type="button" class="btn btn-secondary" (click)="reset()">
            Reset
          </button>
        </div>
      </form>

      <!-- Loading state -->
      @if (companies.isLoading()) {
        <div class="status-bar loading">Loading companies...</div>
      }

      <!-- Error state -->
      @if (companies.error()) {
        <div class="status-bar error">
          Failed to load companies. Make sure the backend is running on
          <code>http://localhost:8080</code>.
        </div>
      }

      <!-- Results -->
      @if (companies.value(); as result) {
        <div class="results-header">
          <span class="total">
            {{ result.page.totalElements }}
            {{ result.page.totalElements === 1 ? 'company' : 'companies' }} found
          </span>
          <span class="page-info">
            Page {{ activeParams().page + 1 }} of {{ result.page.totalPages }}
          </span>
        </div>

        @if (result.items.length === 0) {
          <div class="empty">No companies match your filters.</div>
        } @else {
          <table class="companies-table">
            <thead>
              <tr>
                <th class="col-id">ID</th>
                <th class="col-name">Name</th>
                <th class="col-departments">Departments</th>
              </tr>
            </thead>
            <tbody>
              @for (company of result.items; track company.id) {
                <tr>
                  <td class="col-id">{{ company.id }}</td>
                  <td class="col-name">
                    <a [routerLink]="['/companies', company.id]" class="company-link">
                      {{ company.name }}
                    </a>
                  </td>
                  <td class="col-departments">
                    @if (company.departments && company.departments.length > 0) {
                      <div class="department-list">
                        @for (dept of company.departments; track dept.id) {
                          <span class="department-tag">{{ dept.name }}</span>
                        }
                      </div>
                    } @else {
                      <span class="no-departments">—</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Pagination -->
          @if (result.page.totalPages > 1) {
            <nav class="pagination" aria-label="Pagination">
              <button
                class="btn btn-page"
                [disabled]="activeParams().page === 0"
                (click)="goToPage(activeParams().page - 1)"
                aria-label="Previous page"
              >
                ‹ Prev
              </button>

              @for (page of pages(); track page) {
                <button
                  class="btn btn-page"
                  [class.active]="page === activeParams().page"
                  (click)="goToPage(page)"
                  [attr.aria-current]="page === activeParams().page ? 'page' : null"
                >
                  {{ page + 1 }}
                </button>
              }

              <button
                class="btn btn-page"
                [disabled]="activeParams().page >= result.page.totalPages - 1"
                (click)="goToPage(activeParams().page + 1)"
                aria-label="Next page"
              >
                Next ›
              </button>
            </nav>
          }
        }
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

      h1 {
        font-size: 1.8rem;
        font-weight: 700;
        color: #1a1a2e;
        margin: 0 0 1.5rem;
      }

      /* Filter form */
      .filter-form {
        background: #f8f9fa;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.25rem;
        margin-bottom: 1.5rem;
      }

      .filter-row {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: flex-end;
      }

      .filter-field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        flex: 1;
        min-width: 160px;
      }

      .filter-field label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #555;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .filter-field input,
      .filter-field select {
        padding: 0.5rem 0.75rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 0.95rem;
        background: #fff;
        color: #222;
        transition: border-color 0.15s;
        outline: none;
      }

      .filter-field input:focus,
      .filter-field select:focus {
        border-color: #4361ee;
        box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.12);
      }

      .filter-actions {
        display: flex;
        gap: 0.6rem;
        margin-top: 1rem;
      }

      /* Buttons */
      .btn {
        padding: 0.5rem 1.1rem;
        border: none;
        border-radius: 5px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s, opacity 0.15s;
      }

      .btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .btn-primary {
        background: #4361ee;
        color: #fff;
      }

      .btn-primary:hover:not(:disabled) {
        background: #3451d1;
      }

      .btn-secondary {
        background: #e9ecef;
        color: #495057;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #dee2e6;
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

      /* Results header */
      .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        font-size: 0.9rem;
        color: #555;
      }

      .total {
        font-weight: 600;
        color: #333;
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

      /* Table */
      .companies-table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      }

      .companies-table th {
        background: #1a1a2e;
        color: #fff;
        text-align: left;
        padding: 0.75rem 1rem;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .companies-table td {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #f0f0f0;
        font-size: 0.9rem;
        color: #333;
        vertical-align: top;
      }

      .companies-table tr:last-child td {
        border-bottom: none;
      }

      .companies-table tr:hover td {
        background: #f8f9ff;
      }

      .col-id {
        width: 80px;
        color: #888;
        font-family: monospace;
      }

      .col-name {
        font-weight: 500;
        color: #1a1a2e;
      }

      .company-link {
        color: #4361ee;
        text-decoration: none;
        font-weight: 500;
      }

      .company-link:hover {
        text-decoration: underline;
      }

      .col-departments {
        width: 50%;
      }

      .department-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
      }

      .department-tag {
        background: #eef2ff;
        color: #3451d1;
        border: 1px solid #c7d2fe;
        border-radius: 4px;
        padding: 0.2rem 0.55rem;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .no-departments {
        color: #bbb;
      }

      /* Pagination */
      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.3rem;
        margin-top: 1.5rem;
      }

      .btn-page {
        min-width: 2.2rem;
        padding: 0.4rem 0.7rem;
        background: #fff;
        color: #333;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .btn-page:hover:not(:disabled):not(.active) {
        background: #f0f0f0;
      }

      .btn-page.active {
        background: #4361ee;
        color: #fff;
        border-color: #4361ee;
      }
    `,
  ],
})
export class CompaniesComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly companiesService = inject(CompaniesService);

  // Signal forms — form controls expose values as signals via toSignal()
  readonly form = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl<string>('', { nonNullable: true }),
    size: new FormControl<number>(20, { nonNullable: true }),
  });

  // Route query params → signal (the URL is the single source of truth)
  private readonly queryParams = toSignal(this.route.queryParams, {
    initialValue: {} as Params,
  });

  // Parsed search params derived from the URL
  readonly activeParams = computed<SearchParams>(() => {
    const p = this.queryParams();
    return {
      id: p['id'] ? Number(p['id']) : undefined,
      name: (p['name'] as string) || undefined,
      page: Number(p['page'] ?? 0),
      size: Number(p['size'] ?? 20),
    };
  });

  // Data resource — auto-fetches whenever activeParams changes
  readonly companies = rxResource({
    params: () => this.activeParams(),
    stream: ({ params }) =>
      this.companiesService.searchCompanies(
        params.id,
        params.name,
        params.page,
        params.size,
      ),
  });

  // Visible page numbers (limits to a window of 10 for large page counts)
  readonly pages = computed<number[]>(() => {
    const result = this.companies.value();
    if (!result) return [];
    const total = result.page.totalPages;
    const current = this.activeParams().page;
    const windowSize = 10;
    const half = Math.floor(windowSize / 2);
    const start = Math.max(0, Math.min(current - half, total - windowSize));
    const end = Math.min(total, start + windowSize);
    return Array.from({ length: end - start }, (_, i) => start + i);
  });

  constructor() {
    // Keep the form in sync with the URL (handles back/forward navigation)
    effect(() => {
      const p = this.activeParams();
      untracked(() => {
        this.form.patchValue({
          id: p.id ?? null,
          name: p.name ?? '',
          size: p.size,
        });
      });
    });
  }

  search(): void {
    const { id, name, size } = this.form.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        id: id || undefined,
        name: name || undefined,
        page: 0,
        size: size ?? 20,
      },
      queryParamsHandling: 'replace',
    });
  }

  reset(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'replace',
    });
  }

  goToPage(page: number): void {
    const { id, name, size } = this.activeParams();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        id: id || undefined,
        name: name || undefined,
        page,
        size,
      },
      queryParamsHandling: 'replace',
    });
  }
}
