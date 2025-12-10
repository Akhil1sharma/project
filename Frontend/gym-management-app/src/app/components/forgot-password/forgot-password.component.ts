import { Component, inject, signal } from '@angular/core';
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
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);

  forgotPasswordForm: FormGroup;
  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
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
