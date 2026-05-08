import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../model/entities/user.entity';
import { BaseService } from '../../shared/services/base.service';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<User> {
  constructor() {
    super();
    this.resourceEndpoint = environment.usersEndpointPath;
  }

  getUserRole(): string | null {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    try {
      return JSON.parse(userData).role ?? null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getUserRole() === 'USER';
  }
}
