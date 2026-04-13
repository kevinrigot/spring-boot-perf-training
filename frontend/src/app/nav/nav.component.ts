import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="brand">Company Directory</a>
      <ul class="nav-links">
        <li>
          <a
            routerLink="/companies"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: false }"
          >
            Companies
          </a>
        </li>
        <li>
          <a routerLink="/employees" routerLinkActive="active">Employees</a>
        </li>
      </ul>
    </nav>
  `,
  styles: [
    `
      .navbar {
        display: flex;
        align-items: center;
        gap: 2rem;
        padding: 0 1.5rem;
        height: 56px;
        background: #1a1a2e;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .brand {
        font-size: 1rem;
        font-weight: 700;
        color: #fff;
        text-decoration: none;
        letter-spacing: 0.02em;
        white-space: nowrap;
      }

      .nav-links {
        display: flex;
        gap: 0.25rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .nav-links a {
        display: block;
        padding: 0.4rem 0.9rem;
        color: #a5b4fc;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        border-radius: 6px;
        transition: background 0.15s, color 0.15s;
      }

      .nav-links a:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
      }

      .nav-links a.active {
        background: #4361ee;
        color: #fff;
      }
    `,
  ],
})
export class NavComponent {}
