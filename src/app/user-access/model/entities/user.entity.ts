import { AccountStatus } from './accountStatus.model';
import { Role } from './role.model';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  status: AccountStatus;

  constructor(user: Partial<User> = {}) {
    this.id = user.id ?? 0;
    this.firstName = user.firstName ?? '';
    this.lastName = user.lastName ?? '';
    this.email = user.email ?? '';
    this.password = user.password ?? '';
    this.role = user.role ?? Role.USER;
    this.status = user.status ?? AccountStatus.INACTIVE;
  }
}




