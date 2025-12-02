import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-trainer-dashboard',
  templateUrl: './trainer-dashboard.component.html',
  styleUrls: ['./trainer-dashboard.component.scss']
})
export class TrainerDashboardComponent implements OnInit {
  currentUser: any;
  activeRoute = '';

  menuItems = [
    { label: 'Workouts', route: '/trainer/workouts', icon: 'fitness_center' },
    { label: 'Diet Plans', route: '/trainer/diet-plans', icon: 'restaurant' },
    { label: 'Exercises', route: '/trainer/exercises', icon: 'sports_gymnastics' },
    { label: 'Members', route: '/trainer/members', icon: 'people' }
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

