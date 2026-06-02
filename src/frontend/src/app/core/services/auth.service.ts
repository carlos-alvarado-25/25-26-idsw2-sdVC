import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  email: string;
  rol: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.userSubject.next(JSON.parse(savedUser));
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(res => {
          if (this.isBrowser) {
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
          this.userSubject.next(res.user);
        })
      );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {})
      .pipe(
        finalize(() => {
          if (this.isBrowser) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
          }
          this.userSubject.next(null);
        })
      ).subscribe();
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('accessToken') : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
