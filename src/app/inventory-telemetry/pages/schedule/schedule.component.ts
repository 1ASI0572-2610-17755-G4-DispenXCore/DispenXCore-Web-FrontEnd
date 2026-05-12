import { AfterViewInit, Component, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Dispensator } from '../../model/entities/dispensator.entity';
import { DispensatorService } from '../../services/dispensator.service';
import { ScheduleListComponent } from '../../components/schedule-list/schedule-list.component';
import { ScheduleFormComponent } from '../../components/schedule-form/schedule-form.component';

import { NotificationService } from '../../../shared/services/notification.service';
import {
  NextDispenseTimerComponent
} from '../../../shared/components/next-dispense-timer/next-dispense-timer.component';
import { CapacityBarComponent } from '../../../shared/components/capacity-bar/capacity-bar.component';

/**
 * Page component for Schedule Management.
 *
 * @summary
 * Displays the weekly day selector, the list of schedules for the selected day,
 * the daily summary with capacity bar, and the next dispense countdown.
 * Opens the schedule creation form via a MatDialog.
 */
@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
    ScheduleListComponent,
    NextDispenseTimerComponent,
    CapacityBarComponent,
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
})
export class ScheduleComponent implements OnInit {
  dispensator = signal<Dispensator | null>(null);

  readonly weekDays = [
    { labelKey: 'schedule.days.mon', value: 1 },
    { labelKey: 'schedule.days.tue', value: 2 },
    { labelKey: 'schedule.days.wed', value: 3 },
    { labelKey: 'schedule.days.thu', value: 4 },
    { labelKey: 'schedule.days.fri', value: 5 },
    { labelKey: 'schedule.days.sat', value: 6 },
    { labelKey: 'schedule.days.sun', value: 0 },
  ];

  selectedDay = signal<number>(new Date().getDay());

  private dispensatorService = inject(DispensatorService);
  private notification = inject(NotificationService);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);

  // Hardcoded until backend session provides dispensatorId
  private readonly DISPENSATOR_ID = 1;

  ngOnInit(): void {
    this.dispensatorService.getAll().subscribe({
      next: (list) => {
        const found = list.find((d) => d.id === this.DISPENSATOR_ID);
        if (found) this.dispensator.set(found);
      },
      error: () => {
        this.translate
          .get('schedule.notifications.load-error')
          .subscribe((msg) => this.notification.showError(msg));
      },
    });
  }

  selectDay(value: number): void {
    this.selectedDay.set(value);
  }

  get selectedDayLabelKey(): string {
    return this.weekDays.find((d) => d.value === this.selectedDay())?.labelKey ?? '';
  }

  onNewSchedule(): void {
    const ref = this.dialog.open(ScheduleFormComponent, { width: '480px' });
    ref.componentInstance.dispensatorId = this.DISPENSATOR_ID;
    ref.componentInstance.saved.subscribe(() => {
      this.translate
        .get('schedule.notifications.created')
        .subscribe((msg) => this.notification.showSuccess(msg));
      ref.close();
    });
  }
}
