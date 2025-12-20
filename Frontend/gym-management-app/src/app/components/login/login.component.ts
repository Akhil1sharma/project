import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);
  
  // Image rotation
  currentImageIndex = signal(0);
  private imageRotationInterval?: ReturnType<typeof setInterval>;
  
  readonly gymImages = [
    'low-angle-view-unrecognizable-muscular-build-man-preparing-lifting-barbell-health-club_637285-2497.avif',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    'man-gym-muscle-668bea4582855.avif',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop',
    'strong-muscular-sportsman-is-working-out-pull-weight-machine-gym_232070-22530.avif',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop'
  ];

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  ngOnInit(): void {
    // Start image rotation every 15 seconds
    this.startImageRotation();
  }
  
  ngOnDestroy(): void {
    // Clean up interval when component is destroyed
    if (this.imageRotationInterval) {
      clearInterval(this.imageRotationInterval);
    }
  }
  
  private startImageRotation(): void {
    this.imageRotationInterval = setInterval(() => {
      this.currentImageIndex.set((this.currentImageIndex() + 1) % this.gymImages.length);
    }, 15000); // 15 seconds
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.message || 'Login failed. Please try again.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  loginWithGoogle(): void {
    // This will be implemented when you provide Google credentials
    this.errorMessage.set('Google Sign-In will be configured with your credentials');
    console.log('Google Sign-In clicked - awaiting credentials');
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
