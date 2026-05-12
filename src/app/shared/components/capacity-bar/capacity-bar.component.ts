import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DispensatorStatusResponse } from '../../../inventory-telemetry/model/response/dispensator-status.response';
import { DispensatorService } from '../../../inventory-telemetry/services/dispensator.service';

/**
 * Shared component that displays the daily dispensing summary and capacity progress bar.
 *
 * @summary
 * Fetches dispensator status and shows daily total (g), max capacity,
 * and a visual progress bar indicating percentage used.
 */
@Component({
  selector: 'app-capacity-bar',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './capacity-bar.component.html',
  styleUrl: './capacity-bar.component.css',
})
export class CapacityBarComponent implements OnInit {
  /** ID of the dispensator to fetch status for. */
  @Input() dispensatorId!: number;

  status = signal<DispensatorStatusResponse | null>(null);

  private dispensatorService = inject(DispensatorService);

  ngOnInit(): void {
    this.dispensatorService.getStatus(this.dispensatorId).subscribe({
      next: (data) => this.status.set(data),
    });
  }

  get capacityPercent(): number {
    const s = this.status();
    if (!s || s.maxCapacity === 0) return 0;
    return Math.min(Math.round((s.dailyTotal / s.maxCapacity) * 100), 100);
  }
}
