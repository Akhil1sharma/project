import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { DietPlan } from '../../../models/diet-plan.model';

@Component({
  selector: 'app-diet-plan-form',
  templateUrl: './diet-plan-form.component.html',
  styleUrls: ['./diet-plan-form.component.scss']
})
export class DietPlanFormComponent {
  dietPlanForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<DietPlanFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit'; plan?: DietPlan }
  ) {
    this.dietPlanForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      goal: ['weight_loss', Validators.required],
      duration: [7, Validators.required],
      dailyCalories: [0],
      isPublic: [false],
      meals: [[]]
    });

    if (this.data.mode === 'edit' && this.data.plan) {
      this.dietPlanForm.patchValue(this.data.plan);
    }
  }

  onSubmit(): void {
    if (this.dietPlanForm.valid) {
      this.loading = true;
      if (this.data.mode === 'add') {
        this.apiService.createDietPlan(this.dietPlanForm.value).subscribe({
          next: () => {
            this.snackBar.open('Diet plan created', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Failed to create diet plan', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      } else {
        this.apiService.updateDietPlan(this.data.plan!._id!, this.dietPlanForm.value).subscribe({
          next: () => {
            this.snackBar.open('Diet plan updated', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Failed to update diet plan', 'Close', { duration: 3000 });
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

