import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any;
  activeRoute = '';

  menuItems = [
    { label: 'Members', route: '/admin/members', icon: 'people' },
    { label: 'Workouts', route: '/admin/workouts', icon: 'fitness_center' },
    { label: 'Diet Plans', route: '/admin/diet-plans', icon: 'restaurant' },
    { label: 'Exercises', route: '/admin/exercises', icon: 'sports_gymnastics' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.updateActiveRoute();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveRoute();
      });
  }

  updateActiveRoute(): void {
    this.activeRoute = this.router.url;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }
}

