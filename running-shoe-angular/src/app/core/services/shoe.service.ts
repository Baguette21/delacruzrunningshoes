import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RunningShoe } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoeService {
  private apiUrl = `${environment.apiUrl}/shoes`;

  constructor(private http: HttpClient) {}

  getAllShoes(): Observable<RunningShoe[]> {
    return this.http.get<RunningShoe[]>(this.apiUrl);
  }

  getShoe(id: number): Observable<RunningShoe> {
    return this.http.get<RunningShoe>(`${this.apiUrl}/${id}`);
  }

  getShoesByGender(gender: string): Observable<RunningShoe[]> {
    return this.http.get<RunningShoe[]>(`${this.apiUrl}/gender/${gender}`);
  }

  getShoesByExperience(experience: string): Observable<RunningShoe[]> {
    return this.http.get<RunningShoe[]>(`${this.apiUrl}/experience/${experience}`);
  }

  getShoesByTerrain(terrain: string): Observable<RunningShoe[]> {
    return this.http.get<RunningShoe[]>(`${this.apiUrl}/terrain/${terrain}`);
  }

  getShoesByBrand(brand: string): Observable<RunningShoe[]> {
    return this.http.get<RunningShoe[]>(`${this.apiUrl}/brand/${brand}`);
  }

  createShoe(shoe: RunningShoe): Observable<RunningShoe> {
    return this.http.put<RunningShoe>(this.apiUrl, shoe);
  }

  updateShoe(shoe: RunningShoe): Observable<RunningShoe> {
    return this.http.post<RunningShoe>(this.apiUrl, shoe);
  }

  deleteShoe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateSizeStock(id: number, size: string, gender: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/update-size-stock`, {
      size,
      gender,
      quantity
    });
  }
}

