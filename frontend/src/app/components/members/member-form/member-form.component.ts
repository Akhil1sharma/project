import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss']
})
export class MemberFormComponent implements OnInit {
  memberForm: FormGroup;
  mode: 'add' | 'edit';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<MemberFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit'; member?: User }
  ) {
    this.mode = data.mode;
    this.memberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // Only required for add mode
      phone: [''],
      dateOfBirth: [''],
      gender: [''],
      role: ['member'],
      membershipPlan: ['basic'],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      })
    });

    if (this.mode === 'edit' && data.member) {
      this.memberForm.patchValue(data.member);
      this.memberForm.get('password')?.clearValidators();
    } else {
      this.memberForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.memberForm.valid) {
      this.loading = true;
      const formValue = { ...this.memberForm.value };
      
      if (this.mode === 'add') {
        this.apiService.createUser(formValue).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Member created successfully', 'Close', { duration: 3000 });
              this.dialogRef.close(true);
            }
            this.loading = false;
          },
          error: (error) => {
            this.snackBar.open(error.error?.message || 'Failed to create member', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      } else {
        if (!formValue.password) {
          delete formValue.password;
        }
        this.apiService.updateUser(this.data.member!._id!, formValue).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Member updated successfully', 'Close', { duration: 3000 });
              this.dialogRef.close(true);
            }
            this.loading = false;
          },
          error: (error) => {
            this.snackBar.open(error.error?.message || 'Failed to update member', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

