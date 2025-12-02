import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { MemberFormComponent } from '../member-form/member-form.component';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'phone', 'membershipPlan', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
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
    this.loadMembers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadMembers(): void {
    this.loading = true;
    this.apiService.getUsers({ role: 'member' }).subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource.data = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load members', 'Close', { duration: 3000 });
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
    const dialogRef = this.dialog.open(MemberFormComponent, {
      width: '600px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMembers();
      }
    });
  }

  openEditDialog(member: User): void {
    const dialogRef = this.dialog.open(MemberFormComponent, {
      width: '600px',
      data: { mode: 'edit', member }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMembers();
      }
    });
  }

  deleteMember(member: User): void {
    if (confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`)) {
      this.apiService.deleteUser(member._id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Member deleted successfully', 'Close', { duration: 3000 });
            this.loadMembers();
          }
        },
        error: (error) => {
          this.snackBar.open('Failed to delete member', 'Close', { duration: 3000 });
        }
      });
    }
  }

  canEdit(member: User): boolean {
    return this.currentUser?.role === 'admin' || 
           (this.currentUser?.role === 'member' && this.currentUser?._id === member._id);
  }

  canDelete(member: User): boolean {
    return this.currentUser?.role === 'admin';
  }
}

