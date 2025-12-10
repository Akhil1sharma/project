import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'gym_auth_token';
  private readonly USER_KEY = 'gym_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signals for reactive UI
  isLoggedIn = signal<boolean>(!!this.getToken());
  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor() {
    // Check if user is logged in on initialization
    if (this.getToken()) {
      this.validateToken();
    }
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setSession(response.data);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setSession(response.data);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Login with Google
   */
  loginWithGoogle(googleToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/google-login`, { token: googleToken })
      .pipe(
        tap(response => {
          if (response.success) {
            this.setSession(response.data);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get current user from backend
   */
  getCurrentUser(): Observable<{ success: boolean; data: User }> {
    return this.http.get<{ success: boolean; data: User }>(`${this.API_URL}/me`)
      .pipe(
        tap(response => {
          if (response.success) {
            this.currentUser.set(response.data);
            this.currentUserSubject.next(response.data);
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is logged in
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Validate token with backend
   */
  private validateToken(): void {
    if (this.getToken()) {
      this.getCurrentUser().subscribe({
        error: () => this.logout()
      });
    }
  }

  /**
   * Set user session
   */
  private setSession(authResult: { user: User; token: string }): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
    this.currentUser.set(authResult.user);
    this.isLoggedIn.set(true);
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || 'Server error';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
