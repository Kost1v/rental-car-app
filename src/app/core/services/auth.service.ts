import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, defer, of, throwError } from 'rxjs';
import { AuthResponse, LoginDto, RegisterDto, User } from '../models/user.model';

interface StoredAccount {
  user: User;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly tokenKey = 'token';
  private readonly userKey = 'currentUser';
  private readonly accountsKey = 'registeredAccounts';

  readonly token = signal<string | null>(localStorage.getItem(this.tokenKey));
  readonly currentUser = signal<User | null>(this.readUser());
  readonly isAuthenticated = computed(() => !!this.token());

  register(payload: RegisterDto): Observable<AuthResponse> {
    return defer(() => {
      const accounts = this.readAccounts();
      if (accounts.some(account => account.user.email.toLowerCase() === payload.email.toLowerCase())) {
        return throwError(() => new Error('An account with this email already exists.'));
      }

      const response = this.createResponse(payload.name, payload.email);
      accounts.push({ user: response.user, password: payload.password });
      this.writeAccounts(accounts);
      this.persist(response);
      return of(response);
    });
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return defer(() => {
      if (!credentials.email || !credentials.password) {
        return throwError(() => new Error('Email and password are required.'));
      }

      const account = this.readAccounts().find(item =>
        item.user.email.toLowerCase() === credentials.email.toLowerCase() &&
        item.password === credentials.password,
      );
      if (!account) {
        return throwError(() => new Error('Invalid email or password.'));
      }

      const response = this.createResponse(account.user.name, account.user.email, account.user.id);
      this.persist(response);
      return of(response);
    });
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    void this.router.navigate(['/login']);
  }

  private createResponse(name: string, email: string, id: string = crypto.randomUUID()): AuthResponse {
    return {
      user: { id, name, email },
      token: `mock-token-${crypto.randomUUID()}`,
    };
  }

  private persist(response: AuthResponse): void {
    this.token.set(response.token);
    this.currentUser.set(response.user);
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
  }

  private readUser(): User | null {
    try {
      const saved = localStorage.getItem(this.userKey);
      return saved ? JSON.parse(saved) as User : null;
    } catch {
      return null;
    }
  }

  private readAccounts(): StoredAccount[] {
    try {
      const saved = localStorage.getItem(this.accountsKey);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed as StoredAccount[] : [];
    } catch {
      return [];
    }
  }

  private writeAccounts(accounts: StoredAccount[]): void {
    localStorage.setItem(this.accountsKey, JSON.stringify(accounts));
  }
}
