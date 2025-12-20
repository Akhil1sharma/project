import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);

  forgotPasswordForm: FormGroup;
  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  
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
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  ngOnInit(): void {
    this.startImageRotation();
  }
  
  ngOnDestroy(): void {
    if (this.imageRotationInterval) {
      clearInterval(this.imageRotationInterval);
    }
  }
  
  private startImageRotation(): void {
    this.imageRotationInterval = setInterval(() => {
      this.currentImageIndex.set((this.currentImageIndex() + 1) % this.gymImages.length);
    }, 15000);
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      // Simulate API call - will be implemented when backend has forgot password endpoint
      setTimeout(() => {
        this.isLoading.set(false);
        this.successMessage.set(
          'If an account exists with this email, you will receive password reset instructions.'
        );
        this.forgotPasswordForm.reset();
      }, 1500);
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }
}
