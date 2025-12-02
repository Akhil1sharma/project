import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AdminDashboardComponent } from './components/dashboards/admin-dashboard/admin-dashboard.component';
import { TrainerDashboardComponent } from './components/dashboards/trainer-dashboard/trainer-dashboard.component';
import { MemberDashboardComponent } from './components/dashboards/member-dashboard/member-dashboard.component';
import { MembersListComponent } from './components/members/members-list/members-list.component';
import { WorkoutsListComponent } from './components/workouts/workouts-list/workouts-list.component';
import { DietPlansListComponent } from './components/diet-plans/diet-plans-list/diet-plans-list.component';
import { ExercisesListComponent } from './components/exercises/exercises-list/exercises-list.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'members', pathMatch: 'full' },
      { path: 'members', component: MembersListComponent },
      { path: 'workouts', component: WorkoutsListComponent },
      { path: 'diet-plans', component: DietPlansListComponent },
      { path: 'exercises', component: ExercisesListComponent }
    ]
  },
  {
    path: 'trainer',
    component: TrainerDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['trainer'] },
    children: [
      { path: '', redirectTo: 'workouts', pathMatch: 'full' },
      { path: 'workouts', component: WorkoutsListComponent },
      { path: 'diet-plans', component: DietPlansListComponent },
      { path: 'exercises', component: ExercisesListComponent },
      { path: 'members', component: MembersListComponent }
    ]
  },
  {
    path: 'member',
    component: MemberDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['member'] },
    children: [
      { path: '', redirectTo: 'workouts', pathMatch: 'full' },
      { path: 'workouts', component: WorkoutsListComponent },
      { path: 'diet-plans', component: DietPlansListComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

