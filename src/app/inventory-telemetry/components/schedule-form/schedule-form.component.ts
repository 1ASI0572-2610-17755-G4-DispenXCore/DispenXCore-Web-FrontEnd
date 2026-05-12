import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { Schedule } from '../../model/entities/schedule.entity';
import { ScheduleService } from '../../services/schedule.service';
import { SupplyType } from '../../model/entities/supply-type.model';
import { CreateScheduleRequest } from '../../model/request/create-schedule.request.ts';
import { UpdateScheduleRequest } from '../../model/request/update-schedule.request';

/**
 * Create / edit schedule form dialog.
 * Emits `saved` on success so the parent can refresh and close.
 */
@Component({
  selector: 'app-schedule-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogClose,
    TranslateModule,
  ],
  templateUrl: './schedule-form.component.html',
  styleUrl: './schedule-form.component.css',
})
export class ScheduleFormComponent implements OnInit {
  @Input() dispensatorId!: number;
  @Input() schedule: Schedule | null = null;
  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  supplyTypes = Object.values(SupplyType);

  readonly weekDays = [
    { labelKey: 'schedule.days.mon', value: 1 },
    { labelKey: 'schedule.days.tue', value: 2 },
    { labelKey: 'schedule.days.wed', value: 3 },
    { labelKey: 'schedule.days.thu', value: 4 },
    { labelKey: 'schedule.days.fri', value: 5 },
    { labelKey: 'schedule.days.sat', value: 6 },
    { labelKey: 'schedule.days.sun', value: 0 },
  ];

  private fb = inject(FormBuilder);
  private scheduleService = inject(ScheduleService);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.schedule?.name ?? '', Validators.required],
      supplyType: [this.schedule?.supplyType ?? null, Validators.required],
      amount: [this.schedule?.amount ?? null, [Validators.required, Validators.min(1)]],
      scheduledTime: [this.schedule?.scheduledTime ?? '', Validators.required],
      frequencyDays: [this.schedule?.frequencyDays ?? [], Validators.required],
      smartRefill: [this.schedule?.smartRefill ?? false],
    });
  }

  /** Toggle a day in/out of the frequencyDays array. */
  toggleDay(day: number): void {
    const current: number[] = this.form.value.frequencyDays ?? [];
    const updated = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
    this.form.patchValue({ frequencyDays: updated });
  }

  isDaySelected(day: number): boolean {
    return (this.form.value.frequencyDays ?? []).includes(day);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;

    if (this.schedule) {
      const req = new UpdateScheduleRequest(
        v.name,
        v.supplyType,
        v.amount,
        v.scheduledTime,
        v.frequencyDays,
        v.smartRefill,
      );
      this.scheduleService.update(this.schedule.id, req).subscribe({
        next: () => this.saved.emit(),
      });
    } else {
      const req = new CreateScheduleRequest(
        this.dispensatorId,
        v.name,
        v.supplyType,
        v.amount,
        v.scheduledTime,
        v.frequencyDays,
        v.smartRefill,
      );
      this.scheduleService.create(req).subscribe({
        next: () => this.saved.emit(),
      });
    }
  }
}
