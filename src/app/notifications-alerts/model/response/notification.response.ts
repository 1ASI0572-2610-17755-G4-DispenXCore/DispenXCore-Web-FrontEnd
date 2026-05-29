import { NotificationType } from '../entities/notification-type.model';

export class NotificationResponse {
  constructor(
    public id: number,
    public userId: number,
    public type: NotificationType,
    public title: string,
    public time: string,
    public message: string,
    public action: string | null,
    public unread: boolean,
    public createdAt: string,
  ) {}
}
