import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GymService } from '../../services/gym.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private gymService = inject(GymService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  // Role selection
  selectedRole = signal<'admin' | 'trainer' | 'member'>('member');

  // Gym code validation
  isValidatingGymCode = signal(false);
  gymCodeValid = signal<boolean | null>(null);
  validatedGymName = signal<string | null>(null);

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

  readonly roles: Array<{ value: 'admin' | 'trainer' | 'member'; label: string; description: string }> = [
    { value: 'admin', label: 'Gym Admin', description: 'I\'m opening a new gym' },
    { value: 'trainer', label: 'Trainer', description: 'I\'m joining as a trainer' },
    { value: 'member', label: 'Member', description: 'I\'m joining as a member' }
  ] as const;

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      gender: [''],
      role: ['member', [Validators.required]],
      // Gym code field (for trainer and member)
      gymCode: [''],
      // Gym details (for admin)
      gymName: [''],
      gymEmail: [''],
      gymPhone: [''],
      agreeToTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.startImageRotation();
    this.setupRoleChangeListener();
    this.setupGymCodeValidation();
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

  private setupRoleChangeListener(): void {
    this.registerForm.get('role')?.valueChanges.subscribe((role) => {
      this.selectedRole.set(role);
      this.updateFormValidators(role);
    });
  }

  private updateFormValidators(role: string): void {
    const gymCodeControl = this.registerForm.get('gymCode');
    const gymNameControl = this.registerForm.get('gymName');
    const gymEmailControl = this.registerForm.get('gymEmail');

    // Reset validation messages
    this.gymCodeValid.set(null);
    this.validatedGymName.set(null);

    if (role === 'admin') {
      // Admin needs gym details
      gymCodeControl?.clearValidators();
      gymCodeControl?.setValue('');
      gymCodeControl?.setErrors(null);
      gymNameControl?.setValidators([Validators.required, Validators.minLength(3)]);
      gymEmailControl?.setValidators([Validators.email]);
    } else {
      // Trainer and Member need gym code
      gymCodeControl?.setValidators([Validators.required, Validators.minLength(6)]);
      gymNameControl?.clearValidators();
      gymNameControl?.setValue('');
      gymEmailControl?.clearValidators();
      gymEmailControl?.setValue('');
    }

    gymCodeControl?.updateValueAndValidity();
    gymNameControl?.updateValueAndValidity();
    gymEmailControl?.updateValueAndValidity();
  }

  private setupGymCodeValidation(): void {
    this.registerForm.get('gymCode')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((gymCode) => {
        if (gymCode && gymCode.length >= 6 && this.selectedRole() !== 'admin') {
          this.validateGymCode(gymCode);
        } else {
          this.gymCodeValid.set(null);
          this.validatedGymName.set(null);
        }
      });
  }

  private validateGymCode(gymCode: string): void {
    this.isValidatingGymCode.set(true);
    this.gymService.validateGymCode(gymCode).subscribe({
      next: (response) => {
        this.isValidatingGymCode.set(false);
        if (response.success && response.data.isValid) {
          this.gymCodeValid.set(true);
          this.validatedGymName.set(response.data.gymName);
        } else {
          this.gymCodeValid.set(false);
          this.validatedGymName.set(null);
        }
      },
      error: () => {
        this.isValidatingGymCode.set(false);
        this.gymCodeValid.set(false);
        this.validatedGymName.set(null);
      }
    });
  }

  selectRole(role: 'admin' | 'trainer' | 'member'): void {
    this.registerForm.patchValue({ role });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading()) {
      // Additional validation for gym code
      if (this.selectedRole() !== 'admin' && this.gymCodeValid() !== true) {
        this.errorMessage.set('Please enter a valid gym code');
        return;
      }

      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const { confirmPassword, agreeToTerms, ...userData } = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isLoading.set(false);

          // If admin, show gym code
          if (this.selectedRole() === 'admin' && response.data.gymCode) {
            this.successMessage.set(
              `Gym created successfully! Your gym code is: ${response.data.gymCode}. Please save this code to share with trainers and members.`
            );

            // Navigate to dashboard after 5 seconds
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 5000);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.message || 'Registration failed. Please try again.');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.errorMessage.set('Please fill in all required fields correctly');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  loginWithGoogle(): void {
    this.errorMessage.set('Google Sign-In will be configured with your credentials');
    console.log('Google Sign-In clicked - awaiting credentials');
  }

  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get email() { return this.registerForm.get('email'); }
  get phone() { return this.registerForm.get('phone'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get gender() { return this.registerForm.get('gender'); }
  get agreeToTerms() { return this.registerForm.get('agreeToTerms'); }
}
