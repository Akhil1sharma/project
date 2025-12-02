import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-member-dashboard',
  templateUrl: './member-dashboard.component.html',
  styleUrls: ['./member-dashboard.component.scss']
})
export class MemberDashboardComponent implements OnInit {
  currentUser: any;
  activeRoute = '';

  menuItems = [
    { label: 'Workouts', route: '/member/workouts', icon: 'fitness_center' },
    { label: 'Diet Plans', route: '/member/diet-plans', icon: 'restaurant' }
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

  logout(): void {
    this.authService.logout();
  }
}

