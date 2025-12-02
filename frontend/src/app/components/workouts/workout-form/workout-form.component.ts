import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { Workout } from '../../../models/workout.model';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.scss']
})
export class WorkoutFormComponent {
  workoutForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<WorkoutFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit'; workout?: Workout }
  ) {
    this.workoutForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      type: ['strength', Validators.required],
      difficulty: ['beginner', Validators.required],
      duration: [0],
      isPublic: [false],
      exercises: [[]]
    });

    if (this.data.mode === 'edit' && this.data.workout) {
      this.workoutForm.patchValue(this.data.workout);
    }
  }

  onSubmit(): void {
    if (this.workoutForm.valid) {
      this.loading = true;
      if (this.data.mode === 'add') {
        this.apiService.createWorkout(this.workoutForm.value).subscribe({
          next: () => {
            this.snackBar.open('Workout created', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Failed to create workout', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      } else {
        this.apiService.updateWorkout(this.data.workout!._id!, this.workoutForm.value).subscribe({
          next: () => {
            this.snackBar.open('Workout updated', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Failed to update workout', 'Close', { duration: 3000 });
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

