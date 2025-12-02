import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Workout } from '../../../models/workout.model';
import { WorkoutFormComponent } from '../workout-form/workout-form.component';

@Component({
  selector: 'app-workouts-list',
  templateUrl: './workouts-list.component.html',
  styleUrls: ['./workouts-list.component.scss']
})
export class WorkoutsListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'difficulty', 'duration', 'exercises', 'isPublic', 'actions'];
  dataSource = new MatTableDataSource<Workout>([]);
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
    this.loadWorkouts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadWorkouts(): void {
    this.loading = true;
    this.apiService.getWorkouts().subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource.data = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load workouts', 'Close', { duration: 3000 });
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
    const dialogRef = this.dialog.open(WorkoutFormComponent, {
      width: '800px',
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadWorkouts();
    });
  }

  openEditDialog(workout: Workout): void {
    const dialogRef = this.dialog.open(WorkoutFormComponent, {
      width: '800px',
      data: { mode: 'edit', workout }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadWorkouts();
    });
  }

  deleteWorkout(workout: Workout): void {
    if (confirm(`Delete ${workout.name}?`)) {
      this.apiService.deleteWorkout(workout._id!).subscribe({
        next: () => {
          this.snackBar.open('Workout deleted', 'Close', { duration: 3000 });
          this.loadWorkouts();
        },
        error: () => {
          this.snackBar.open('Failed to delete workout', 'Close', { duration: 3000 });
        }
      });
    }
  }

  canEdit(): boolean {
    return ['admin', 'trainer'].includes(this.currentUser?.role);
  }
}

