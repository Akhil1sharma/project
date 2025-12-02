import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Exercise } from '../models/exercise.model';
import { Workout } from '../models/workout.model';
import { DietPlan } from '../models/diet-plan.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Users API
  getUsers(params?: any): Observable<{ success: boolean; count: number; data: User[] }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<{ success: boolean; count: number; data: User[] }>(`${this.apiUrl}/users`, { params: httpParams });
  }

  getUser(id: string): Observable<{ success: boolean; data: User }> {
    return this.http.get<{ success: boolean; data: User }>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: Partial<User>): Observable<{ success: boolean; message: string; data: User }> {
    return this.http.post<{ success: boolean; message: string; data: User }>(`${this.apiUrl}/users`, user);
  }

  updateUser(id: string, user: Partial<User>): Observable<{ success: boolean; message: string; data: User }> {
    return this.http.put<{ success: boolean; message: string; data: User }>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/users/${id}`);
  }

  // Exercises API
  getExercises(params?: any): Observable<{ success: boolean; count: number; data: Exercise[] }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<{ success: boolean; count: number; data: Exercise[] }>(`${this.apiUrl}/exercises`, { params: httpParams });
  }

  getExercise(id: string): Observable<{ success: boolean; data: Exercise }> {
    return this.http.get<{ success: boolean; data: Exercise }>(`${this.apiUrl}/exercises/${id}`);
  }

  createExercise(exercise: Partial<Exercise>): Observable<{ success: boolean; message: string; data: Exercise }> {
    return this.http.post<{ success: boolean; message: string; data: Exercise }>(`${this.apiUrl}/exercises`, exercise);
  }

  updateExercise(id: string, exercise: Partial<Exercise>): Observable<{ success: boolean; message: string; data: Exercise }> {
    return this.http.put<{ success: boolean; message: string; data: Exercise }>(`${this.apiUrl}/exercises/${id}`, exercise);
  }

  deleteExercise(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/exercises/${id}`);
  }

  // Workouts API
  getWorkouts(params?: any): Observable<{ success: boolean; count: number; data: Workout[] }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<{ success: boolean; count: number; data: Workout[] }>(`${this.apiUrl}/workouts`, { params: httpParams });
  }

  getWorkout(id: string): Observable<{ success: boolean; data: Workout }> {
    return this.http.get<{ success: boolean; data: Workout }>(`${this.apiUrl}/workouts/${id}`);
  }

  createWorkout(workout: Partial<Workout>): Observable<{ success: boolean; message: string; data: Workout }> {
    return this.http.post<{ success: boolean; message: string; data: Workout }>(`${this.apiUrl}/workouts`, workout);
  }

  updateWorkout(id: string, workout: Partial<Workout>): Observable<{ success: boolean; message: string; data: Workout }> {
    return this.http.put<{ success: boolean; message: string; data: Workout }>(`${this.apiUrl}/workouts/${id}`, workout);
  }

  deleteWorkout(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/workouts/${id}`);
  }

  // Diet Plans API
  getDietPlans(params?: any): Observable<{ success: boolean; count: number; data: DietPlan[] }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<{ success: boolean; count: number; data: DietPlan[] }>(`${this.apiUrl}/diet-plans`, { params: httpParams });
  }

  getDietPlan(id: string): Observable<{ success: boolean; data: DietPlan }> {
    return this.http.get<{ success: boolean; data: DietPlan }>(`${this.apiUrl}/diet-plans/${id}`);
  }

  createDietPlan(dietPlan: Partial<DietPlan>): Observable<{ success: boolean; message: string; data: DietPlan }> {
    return this.http.post<{ success: boolean; message: string; data: DietPlan }>(`${this.apiUrl}/diet-plans`, dietPlan);
  }

  updateDietPlan(id: string, dietPlan: Partial<DietPlan>): Observable<{ success: boolean; message: string; data: DietPlan }> {
    return this.http.put<{ success: boolean; message: string; data: DietPlan }>(`${this.apiUrl}/diet-plans/${id}`, dietPlan);
  }

  deleteDietPlan(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/diet-plans/${id}`);
  }
}

