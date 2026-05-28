import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationType } from '../../model/entities/notification-type.model';
import { NotificationsStateService } from '../../services/notifications-state.service';

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './notifications-dropdown.component.html',
  styleUrl: './notifications-dropdown.component.css',
})
export class NotificationsDropdownComponent implements OnInit {
  isOpen = signal(false);
  NotificationType = NotificationType;

  private router = inject(Router);
  private elRef = inject(ElementRef);
  private state = inject(NotificationsStateService);

  unreadCount = this.state.unreadCount;

  get previewNotifications() {
    return this.state
      .notifications()
      .filter((n) => n.unread)
      .slice(0, 3);
  }

  ngOnInit(): void {
    this.state.load();
  }

  toggle(): void {
    this.isOpen.set(!this.isOpen());
  }

  onViewHistory(): void {
    this.isOpen.set(false);
    this.router.navigate(['/notifications']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
