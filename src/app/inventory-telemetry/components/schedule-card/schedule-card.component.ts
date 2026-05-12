import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Schedule } from '../../model/entities/schedule.entity';
import { ScheduleService } from '../../services/schedule.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SlicePipe } from '@angular/common';

/**
 * Displays a single schedule row with time bubble, name, amount,
 * active badge, toggle and edit button.
 */
@Component({
  selector: 'app-schedule-card',
  standalone: true,
  imports: [MatSlideToggle, MatIcon, MatIconButton, MatTooltip, TranslateModule, SlicePipe],
  templateUrl: './schedule-card.component.html',
  styleUrl: './schedule-card.component.css',
})
export class ScheduleCardComponent {
  @Input() schedule!: Schedule;

  /** Emits when active state is toggled → parent reloads list. */
  @Output() toggled = new EventEmitter<void>();

  /** Emits when the edit button is clicked → parent opens form. */
  @Output() edit = new EventEmitter<Schedule>();

  private scheduleService = inject(ScheduleService);

  onToggle(isActive: boolean): void {
    this.scheduleService.toggleActive(this.schedule.id, isActive).subscribe({
      next: () => this.toggled.emit(),
    });
  }

  onEdit(): void {
    this.edit.emit(this.schedule);
  }
}
