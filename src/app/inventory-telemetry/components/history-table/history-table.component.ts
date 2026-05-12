import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';

import { DispenserEvent } from '../../model/entities/dispenserEvent.entity';
import { TriggerBadgeComponent } from '../../../shared/components/trigger-badge/trigger-badge.component';
import { SupplyTypeBadgeComponent } from '../../../shared/components/supply-type-badge/supply-type-badge.component';

@Component({
  selector: 'app-history-table',
  standalone: true,
  imports: [
    TranslateModule,
    MatProgressSpinnerModule,
    DatePipe,
    TriggerBadgeComponent,
    SupplyTypeBadgeComponent,
  ],
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.css',
})
export class HistoryTableComponent {
  @Input() events: DispenserEvent[] = [];
  @Input() isLoading = false;

  readonly PAGE_SIZE = 10;
  currentPage = 1;

  get endItem(): number {
    return Math.min(this.currentPage * this.PAGE_SIZE, this.events.length);
  }

  get totalPages(): number {
    return Math.ceil(this.events.length / this.PAGE_SIZE);
  }

  get pagedEvents(): DispenserEvent[] {
    const start = (this.currentPage - 1) * this.PAGE_SIZE;
    return this.events.slice(start, start + this.PAGE_SIZE);
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }
}
