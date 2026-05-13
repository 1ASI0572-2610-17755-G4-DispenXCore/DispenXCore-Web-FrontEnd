import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

interface StoredUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './user-dropdown.component.html',
  styleUrl: './user-dropdown.component.css',
})
export class UserDropdownComponent implements OnInit {
  isOpen = signal(false);
  currentUser = signal<StoredUser | null>(null);

  // Inicial del nombre para el avatar
  avatarInitial = computed(() => {
    const user = this.currentUser();
    return user?.firstName?.charAt(0).toUpperCase() ?? '?';
  });

  // Nombre completo
  fullName = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  });

  private router = inject(Router);
  private elRef = inject(ElementRef);

  ngOnInit() {
    this.loadUser();
  }

  private loadUser() {
    try {
      const raw = localStorage.getItem('userData');
      if (raw) this.currentUser.set(JSON.parse(raw));
    } catch {
      this.currentUser.set(null);
    }
  }

  toggle() {
    this.loadUser(); // refresca por si cambió
    this.isOpen.set(!this.isOpen());
  }

  onEditProfile() {
    this.isOpen.set(false);
    this.router.navigate(['/not-found']);
  }

  onLogout() {
    this.isOpen.set(false);
    localStorage.removeItem('userData');
    this.router.navigate(['/sign-in']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
