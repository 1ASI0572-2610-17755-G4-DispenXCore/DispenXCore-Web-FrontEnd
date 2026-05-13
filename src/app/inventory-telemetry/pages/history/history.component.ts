import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { DispenserEvent } from '../../model/entities/dispenserEvent.entity';
import { SupplyType } from '../../model/entities/supply-type.model';
import { TelemetryService, HistoryPeriod } from '../../services/telemetry.service';
import { DispensatorService } from '../../services/dispensator.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Dispensator } from '../../model/entities/dispensator.entity';
import { HistoryChartComponent } from '../../components/history-chart/history-chart.component';
import { HistoryTableComponent } from '../../components/history-table/history-table.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    HistoryChartComponent,
    HistoryTableComponent,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  dispensator = signal<Dispensator | null>(null);
  events = signal<DispenserEvent[]>([]);
  isLoading = signal(false);

  // Signal for period (used in template with selectedPeriod())
  selectedPeriod = signal<HistoryPeriod>(7);

  // Plain property for supply filter (only used locally, no need for signal)
  selectedSupplyType: SupplyType | 'all' = 'all';

  readonly periods: { value: HistoryPeriod; labelKey: string }[] = [
    { value: 7, labelKey: 'history.period.7days' },
    { value: 30, labelKey: 'history.period.30days' },
  ];

  readonly supplyTypes = Object.values(SupplyType);

  private readonly DISPENSATOR_ID = 1;

  private telemetry = inject(TelemetryService);
  private dispensatorSvc = inject(DispensatorService);
  private notification = inject(NotificationService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.dispensatorSvc.getAll().subscribe({
      next: (list) => {
        const found = list.find((d) => d.id === this.DISPENSATOR_ID);
        if (found) this.dispensator.set(found);
      },
    });
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading.set(true);
    this.telemetry.getHistory(this.DISPENSATOR_ID, this.selectedPeriod()).subscribe({
      next: (data) => {
        this.events.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.translate
          .get('history.notifications.load-error')
          .subscribe((msg) => this.notification.showError(msg));
        this.isLoading.set(false);
      },
    });
  }

  get filteredEvents(): DispenserEvent[] {
    return this.selectedSupplyType === 'all'
      ? this.events()
      : this.events().filter((e) => e.supplyType === this.selectedSupplyType);
  }

  get weeklyAverage(): number {
    const evs = this.events();
    if (!evs.length) return 0;
    const total = evs.reduce((acc, e) => acc + e.amountDispensed, 0);
    return Math.round(total / this.selectedPeriod());
  }

  get totalKg(): string {
    const total = this.events().reduce((acc, e) => acc + e.amountDispensed, 0);
    return (total / 1000).toFixed(1);
  }

  onPeriodChange(period: HistoryPeriod): void {
    this.selectedPeriod.set(period);
    this.loadHistory();
  }

  exportCsv(): void {
    const headers = ['Date', 'Supply Type', 'Amount (g)', 'Trigger'];
    const rows = this.filteredEvents.map((e) => [
      new Date(e.dispensedAt).toLocaleString(),
      e.supplyType ?? '',
      e.amountDispensed,
      e.trigger,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history-${this.selectedPeriod()}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
