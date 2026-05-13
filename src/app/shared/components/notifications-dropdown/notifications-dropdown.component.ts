import { Component, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './notifications-dropdown.component.html',
  styleUrl: './notifications-dropdown.component.css',
})
export class NotificationDropdownComponent {
  isOpen = signal(false);

  notifications = [
    {
      type: 'alert',
      title: 'System Alert',
      time: '2 minutes ago',
      message: 'Low stock detected in Bin 2. Capacity at 15%.',
      action: 'Reorder Stock',
      unread: true,
    },
    {
      type: 'success',
      title: 'Dispensed Completed',
      time: '08:00 AM',
      message: 'Schedule executed successfully. 500g of Brown Rice have been dispensed.',
      action: null,
      unread: false,
    },
    {
      type: 'info',
      title: 'Firmware Update',
      time: 'Yesterday',
      message: 'Version v2.4.1 has been successfully installed on all operational nodes.',
      action: null,
      unread: false,
    },
  ];

  constructor(
    private router: Router,
    private elRef: ElementRef,
  ) {}

  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  onViewHistory() {
    this.isOpen.set(false);
    this.router.navigate(['/not-found']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
