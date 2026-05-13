import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { interval, Subscription } from 'rxjs';
import { DispensatorStatusResponse } from '../../../inventory-telemetry/model/response/dispensator-status.response';
import { DispensatorService } from '../../../inventory-telemetry/services/dispensator.service';

/**
 * Shared component that displays a live countdown to the next dispensing event.
 *
 * @summary
 * Polls the dispensator status and computes a countdown from now to `nextDispenseAt`.
 * Also shows the name and amount of the next scheduled dispense.
 * Refreshes automatically when the countdown reaches zero.
 */
@Component({
  selector: 'app-next-dispense-timer',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './next-dispense-timer.component.html',
  styleUrl: './next-dispense-timer.component.css',
})
export class NextDispenseTimerComponent implements OnInit, OnDestroy {
  /** ID of the dispensator to monitor. */
  @Input() dispensatorId!: number;

  status = signal<DispensatorStatusResponse | null>(null);
  countdown = signal<string>('--:--:--');

  private dispensatorService = inject(DispensatorService);
  private timerSub?: Subscription;

  ngOnInit(): void {
    this.loadStatus();
  }

  private loadStatus(): void {
    this.dispensatorService.getStatus(this.dispensatorId).subscribe({
      next: (data) => {
        this.status.set(data);
        this.startCountdown(data.nextDispenseAt);
      },
    });
  }

  private startCountdown(nextDispenseAt: string | null): void {
    this.timerSub?.unsubscribe();
    if (!nextDispenseAt) {
      this.countdown.set('--:--:--');
      return;
    }

    this.timerSub = interval(1000).subscribe(() => {
      const diff = new Date(nextDispenseAt).getTime() - Date.now();
      if (diff <= 0) {
        this.countdown.set('00:00:00');
        this.loadStatus();
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      this.countdown.set(`${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`);
    });
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }
}
