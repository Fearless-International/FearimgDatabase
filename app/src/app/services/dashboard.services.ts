import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environnment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private piUrl = environment.strapiUrl;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.piUrl}/dashboard/stats`);
  }

  getRecentBookings(): Observable<any> {
    return this.http.get(`${this.piUrl}/bookings?sort=createdAt:desc&limit=10`);
  }

  getChartData(period: string = 'month'): Observable<any> {
    return this.http.get(`${this.piUrl}/dashboard/analytics?period=${period}`);
  }

  getUserNotifications(): Observable<any> {
    return this.http.get(`${this.piUrl}/notifications`);
  }
}