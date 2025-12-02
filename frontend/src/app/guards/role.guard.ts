import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Array<string>;
    const user = this.authService.currentUserValue;

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRoles && expectedRoles.length > 0) {
      if (this.authService.hasAnyRole(expectedRoles)) {
        return true;
      } else {
        // Redirect to appropriate dashboard based on user role
        this.router.navigate([`/${user.role}`]);
        return false;
      }
    }

    return true;
  }
}

