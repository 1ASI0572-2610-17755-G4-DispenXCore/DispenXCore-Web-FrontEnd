import { NotificationType } from './notification-type.model';

export class Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  time: string;
  message: string;
  action: string | null;
  unread: boolean;
  createdAt: Date;

  constructor(notification: Partial<Notification> = {}) {
    this.id = notification.id ?? 0;
    this.userId = notification.userId ?? 0;
    this.type = notification.type ?? NotificationType.INFO;
    this.title = notification.title ?? '';
    this.time = notification.time ?? '';
    this.message = notification.message ?? '';
    this.action = notification.action ?? null;
    this.unread = notification.unread ?? false;
    this.createdAt = notification.createdAt ? new Date(notification.createdAt) : new Date();
  }
}
