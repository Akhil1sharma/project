import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gym, GymValidationResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/gyms`;

  /**
   * Validate gym code
   */
  validateGymCode(gymCode: string): Observable<GymValidationResponse> {
    return this.http.get<GymValidationResponse>(`${this.API_URL}/validate/${gymCode}`);
  }

  /**
   * Get current user's gym details
   */
  getMyGym(): Observable<{ success: boolean; data: Gym }> {
    return this.http.get<{ success: boolean; data: Gym }>(`${this.API_URL}/my-gym`);
  }

  /**
   * Get gym details by ID (admin only)
   */
  getGym(gymId: string): Observable<{ success: boolean; data: Gym }> {
    return this.http.get<{ success: boolean; data: Gym }>(`${this.API_URL}/${gymId}`);
  }

  /**
   * Update gym details (admin only)
   */
  updateGym(gymId: string, gymData: Partial<Gym>): Observable<{ success: boolean; message: string; data: Gym }> {
    return this.http.put<{ success: boolean; message: string; data: Gym }>(`${this.API_URL}/${gymId}`, gymData);
  }

  /**
   * Get all gym users (admin only)
   */
  getGymUsers(filters?: { role?: string; isActive?: boolean; search?: string }): Observable<{ success: boolean; count: number; data: any[] }> {
    let url = `${this.API_URL}/users`;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.search) params.append('search', filters.search);
      url += `?${params.toString()}`;
    }
    return this.http.get<{ success: boolean; count: number; data: any[] }>(url);
  }

  /**
   * Update user status (admin only)
   */
  updateUserStatus(userId: string, isActive: boolean): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.put<{ success: boolean; message: string; data: any }>(`${this.API_URL}/users/${userId}/status`, { isActive });
  }

  /**
   * Delete gym user (admin only)
   */
  deleteGymUser(userId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/users/${userId}`);
  }

  /**
   * Get gym statistics (admin only)
   */
  getGymStatistics(): Observable<{ success: boolean; data: any }> {
    return this.http.get<{ success: boolean; data: any }>(`${this.API_URL}/statistics`);
  }
}
