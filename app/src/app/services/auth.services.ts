import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

interface User {
  login: string;
  token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
        this.currentUser = this.currentUserSubject.asObservable();
    }

    private getCurrentUser(): User | null {
        if (isPlatformBrowser(this.platformId)) {
            const userStr = localStorage.getItem('currentUser');
            if (userStr) {
                try {
                    return JSON.parse(userStr);
                } catch {
                    return null;
                }
            }
        }
        return null;
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(_username: string, _password: string): Observable<boolean> {
        // Implement your login logic here
        // For now, we'll simulate a successful login
        if (isPlatformBrowser(this.platformId)) {
            const user: User = {
                login: 'fmjmadeit',
                token: 'dummy-token'
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', 'dummy-token');
            this.currentUserSubject.next(user);
        }
        return new Observable<boolean>((observer) => {
            observer.next(true);
            observer.complete();
        });
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            this.currentUserSubject.next(null);
        }
    }

    isLoggedIn(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return !!localStorage.getItem('token');
        }
        return false;
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('token');
        }
        return null;
    }
}

function of(_arg0: boolean): Observable<boolean> {
    throw new Error('Function not implemented.');
}
