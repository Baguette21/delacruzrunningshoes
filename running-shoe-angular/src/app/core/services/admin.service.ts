import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminStats {
  totalShoes: number;
  status: string;
}

export interface ClearResponse {
  message: string;
  deletedCount: number;
}

export interface ReloadResponse {
  message: string;
  deletedCount: number;
  loadedCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.adminApiUrl;

  constructor(private http: HttpClient) {}

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/shoes/stats`);
  }

  clearAllShoes(): Observable<ClearResponse> {
    return this.http.delete<ClearResponse>(`${this.apiUrl}/shoes/clear`);
  }

  reloadFromCSV(): Observable<ReloadResponse> {
    return this.http.post<ReloadResponse>(`${this.apiUrl}/shoes/reload`, {});
  }
}

