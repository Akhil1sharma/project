import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Welcome to Gym Management System</h1>
        <p>Hello, {{ currentUser()?.firstName }} {{ currentUser()?.lastName }}!</p>
        <p class="role-badge">Role: {{ currentUser()?.role }}</p>
      </div>
      
      <div class="dashboard-content">
        <div class="info-card">
          <h2>🎉 Successfully Logged In!</h2>
          <p>Your authentication is working properly.</p>
          <p>Email: {{ currentUser()?.email }}</p>
          <button class="btn btn-logout" (click)="logout()">Logout</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .dashboard-header {
      text-align: center;
      color: white;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.25rem;
        margin: 0.5rem 0;
      }

      .role-badge {
        display: inline-block;
        background: rgba(255, 255, 255, 0.2);
        padding: 0.5rem 1.5rem;
        border-radius: 50px;
        margin-top: 1rem;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 1px;
      }
    }

    .dashboard-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .info-card {
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      text-align: center;

      h2 {
        color: #333;
        margin-bottom: 1rem;
        font-size: 1.75rem;
      }

      p {
        color: #666;
        margin: 0.75rem 0;
        font-size: 1.1rem;
      }

      .btn-logout {
        margin-top: 2rem;
        padding: 0.875rem 2rem;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #c82333;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }
      }
    }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
