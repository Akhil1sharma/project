import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Exercise } from '../../../models/exercise.model';
import { ExerciseFormComponent } from '../exercise-form/exercise-form.component';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.component.html',
  styleUrls: ['./exercises-list.component.scss']
})
export class ExercisesListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'difficulty', 'equipment', 'actions'];
  dataSource = new MatTableDataSource<Exercise>([]);
  loading = false;
  currentUser: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadExercises(): void {
    this.loading = true;
    this.apiService.getExercises().subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource.data = response.data;
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load exercises', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ExerciseFormComponent, {
      width: '600px',
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadExercises();
    });
  }

  openEditDialog(exercise: Exercise): void {
    const dialogRef = this.dialog.open(ExerciseFormComponent, {
      width: '600px',
      data: { mode: 'edit', exercise }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadExercises();
    });
  }

  deleteExercise(exercise: Exercise): void {
    if (confirm(`Delete ${exercise.name}?`)) {
      this.apiService.deleteExercise(exercise._id!).subscribe({
        next: () => {
          this.snackBar.open('Exercise deleted', 'Close', { duration: 3000 });
          this.loadExercises();
        },
        error: () => {
          this.snackBar.open('Failed to delete exercise', 'Close', { duration: 3000 });
        }
      });
    }
  }

  canEdit(): boolean {
    return ['admin', 'trainer'].includes(this.currentUser?.role);
  }
}

