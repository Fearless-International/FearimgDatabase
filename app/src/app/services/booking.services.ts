import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environnment';
import { Observable } from 'rxjs';

export interface bookingData {
  service: string;
  date: string;
  time: string;
  notes: string;
  statuses: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createBooking(bookingData: bookingData): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const payload = { data: bookingData }; // Wrap bookingData with `data` key
    return this.http.post(`${this.apiUrl}/api/bookings`, payload, { headers });
  }

  getBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/bookings`);
  }

  updateBooking(id: string, bookingData: Partial<bookingData>): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const payload = { data: bookingData }; // Wrap partial bookingData with `data` key
    return this.http.put(`${this.apiUrl}/api/bookings/${id}`, payload, { headers });
  }

  deleteBooking(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/bookings/${id}`);
  }
}
