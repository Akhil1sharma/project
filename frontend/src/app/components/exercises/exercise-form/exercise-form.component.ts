import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { Exercise } from '../../../models/exercise.model';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss']
})
export class ExerciseFormComponent {
  exerciseForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<ExerciseFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit'; exercise?: Exercise }
  ) {
    this.exerciseForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: ['strength', Validators.required],
      difficulty: ['beginner', Validators.required],
      equipment: ['bodyweight', Validators.required],
      muscleGroups: [[]],
      instructions: [[]]
    });

    if (this.data.mode === 'edit' && this.data.exercise) {
      this.exerciseForm.patchValue(this.data.exercise);
    }
  }

  onSubmit(): void {
    if (this.exerciseForm.valid) {
      this.loading = true;
      if (this.data.mode === 'add') {
        this.apiService.createExercise(this.exerciseForm.value).subscribe({
          next: () => {
            this.snackBar.open('Exercise created', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Failed to create exercise', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      } else {
        this.apiService.updateExercise(this.data.exercise!._id!, this.exerciseForm.value).subscribe({
          next: () => {
            this.snackBar.open('Exercise updated', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Failed to update exercise', 'Close', { duration: 3000 });
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

