import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';

import { Schedule } from '../../model/entities/schedule.entity';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleCardComponent } from '../schedule-card/schedule-card.component';
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';
import { NotificationService } from '../../../shared/services/notification.service';

/**
 * Fetches and renders all schedules for a dispensator filtered by day.
 * Delegates edit/create to ScheduleFormComponent via MatDialog.
 */
@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [ScheduleCardComponent, MatProgressSpinner, TranslateModule, MatIcon],
  templateUrl: './schedule-list.component.html',
  styleUrl: './schedule-list.component.css',
})
export class ScheduleListComponent implements OnInit, OnChanges {
  @Input() dispensatorId!: number;
  @Input() filterDay?: number;

  schedules = signal<Schedule[]>([]);
  isLoading = signal<boolean>(false);

  private scheduleService = inject(ScheduleService);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.loadSchedules();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterDay'] && !changes['filterDay'].firstChange) {
      this.loadSchedules();
    }
  }

  loadSchedules(): void {
    this.isLoading.set(true);
    this.scheduleService.getByDispensator(this.dispensatorId).subscribe({
      next: (data) => {
        const filtered =
          this.filterDay !== undefined
            ? data.filter((s) => s.frequencyDays.includes(this.filterDay!))
            : data;
        this.schedules.set(filtered);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onScheduleToggled(): void {
    this.loadSchedules();
  }

  onEdit(schedule: Schedule): void {
    const ref = this.dialog.open(ScheduleFormComponent, { width: '480px' });
    ref.componentInstance.dispensatorId = this.dispensatorId;
    ref.componentInstance.schedule = schedule;
    ref.componentInstance.saved.subscribe(() => {
      this.translate
        .get('schedule.notifications.updated')
        .subscribe((msg) => this.notification.showSuccess(msg));
      ref.close();
      this.loadSchedules();
    });
  }
}
