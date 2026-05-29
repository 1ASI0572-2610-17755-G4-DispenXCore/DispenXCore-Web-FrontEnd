import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationType } from '../../model/entities/notification-type.model';
import { NotificationsStateService } from '../../services/notifications-state.service';

type FilterTab = 'all' | 'alert' | 'info';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  activeTab = signal<FilterTab>('all');
  hideRead = signal(false);
  NotificationType = NotificationType;

  readonly tabs: { labelKey: string; value: FilterTab }[] = [
    { labelKey: 'notifications.tabs.all', value: 'all' },
    { labelKey: 'notifications.tabs.alerts', value: 'alert' },
    { labelKey: 'notifications.tabs.schedules', value: 'info' },
  ];

  private location = inject(Location);
  private state = inject(NotificationsStateService);

  ngOnInit(): void {
    this.state.load();
  }

  get filteredNotifications() {
    const tab = this.activeTab();
    let list = this.state.notifications();

    if (tab === 'alert') list = list.filter((n) => n.type === NotificationType.ALERT);
    if (tab === 'info') list = list.filter((n) => n.type === NotificationType.INFO);
    if (this.hideRead()) list = list.filter((n) => n.unread);

    return list;
  }

  markAsRead(id: number): void {
    this.state.markAsRead(id);
  }

  delete(id: number): void {
    this.state.delete(id);
  }

  setTab(tab: FilterTab): void {
    this.activeTab.set(tab);
  }

  getIcon(type: NotificationType): string {
    if (type === NotificationType.ALERT) return 'warning';
    if (type === NotificationType.SUCCESS) return 'check_circle';
    return 'system_update';
  }

  goBack(): void {
    this.location.back();
  }
}
