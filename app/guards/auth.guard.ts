import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): Observable<boolean> {
    // Check if we're in the browser
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      
      if (token) {
        // User is logged in
        return of(true);
      } else {
        // User is not logged in, redirect to login
        this.router.navigate(['/login']);
        return of(false);
      }
    }
    
    // If we're on the server, allow the route to activate
    // The actual auth check will happen on the client
    return of(true);
  }
}