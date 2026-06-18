import { Injectable, inject, signal, computed } from '@angular/core';
import { Notification } from '../model/entities/notification.entity';
import { NotificationsApiService } from './notificationsApi.service';
import { forkJoin } from 'rxjs';
import { UserService } from '../../user-access/services/user.service';

@Injectable({ providedIn: 'root' })
export class NotificationsStateService {
  private notificationApi = inject(NotificationsApiService);
  private userService = inject(UserService);

  notifications = signal<Notification[]>([]);

  unreadCount = computed(() => this.notifications().filter((n) => n.unread).length);

  load(): void {
    const userId = this.userService.getCurrentUserId();
    if (!userId) return;

    this.notificationApi.getByUserId(userId).subscribe({
      next: (list) => this.notifications.set(list),
      error: (err) => console.error('Failed to load notifications', err),
    });
  }

  markAsRead(id: string): void {
    this.notificationApi.markAsRead(id).subscribe({
      next: () =>
        this.notifications.update((list) =>
          list.map((n) => (n.id === id ? { ...n, unread: false } : n)),
        ),
      error: (err) => console.error('Failed to mark as read', err),
    });
  }

  markAllAsRead(): void {
    const unread = this.notifications().filter((n) => n.unread);
    if (!unread.length) return;

    forkJoin(unread.map((n) => this.notificationApi.markAsRead(n.id))).subscribe({
      next: () => this.notifications.update((list) => list.map((n) => ({ ...n, unread: false }))),
      error: (err) => console.error('Failed to mark all as read', err),
    });
  }

  delete(id: string): void {
    this.notificationApi.delete(id).subscribe({
      next: () => this.notifications.update((list) => list.filter((n) => n.id !== id)),
      error: (err) => console.error('Failed to delete notification', err),
    });
  }

}
