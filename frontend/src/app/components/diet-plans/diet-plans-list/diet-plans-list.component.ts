import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { DietPlan } from '../../../models/diet-plan.model';
import { DietPlanFormComponent } from '../diet-plan-form/diet-plan-form.component';

@Component({
  selector: 'app-diet-plans-list',
  templateUrl: './diet-plans-list.component.html',
  styleUrls: ['./diet-plans-list.component.scss']
})
export class DietPlansListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'goal', 'duration', 'dailyCalories', 'isPublic', 'actions'];
  dataSource = new MatTableDataSource<DietPlan>([]);
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
    this.loadDietPlans();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDietPlans(): void {
    this.loading = true;
    this.apiService.getDietPlans().subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource.data = response.data;
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load diet plans', 'Close', { duration: 3000 });
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
    const dialogRef = this.dialog.open(DietPlanFormComponent, {
      width: '800px',
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadDietPlans();
    });
  }

  openEditDialog(plan: DietPlan): void {
    const dialogRef = this.dialog.open(DietPlanFormComponent, {
      width: '800px',
      data: { mode: 'edit', plan }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadDietPlans();
    });
  }

  deleteDietPlan(plan: DietPlan): void {
    if (confirm(`Delete ${plan.name}?`)) {
      this.apiService.deleteDietPlan(plan._id!).subscribe({
        next: () => {
          this.snackBar.open('Diet plan deleted', 'Close', { duration: 3000 });
          this.loadDietPlans();
        },
        error: () => {
          this.snackBar.open('Failed to delete diet plan', 'Close', { duration: 3000 });
        }
      });
    }
  }

  canEdit(): boolean {
    return ['admin', 'trainer'].includes(this.currentUser?.role);
  }
}

