import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DispenserEvent } from '../../model/entities/dispenserEvent.entity';

interface ChartPoint {
  day: string;
  value: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-history-chart',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './history-chart.component.html',
  styleUrl: './history-chart.component.css',
})
export class HistoryChartComponent implements OnChanges {
  @Input() events: DispenserEvent[] = [];
  @Input() period: 7 | 30 = 7;
  @Input() isLoading = false;

  readonly W = 560;
  readonly H = 200;
  readonly PAD = { top: 16, right: 16, bottom: 32, left: 44 };

  points = signal<ChartPoint[]>([]);
  polyline = signal('');
  area = signal('');
  yTicks = signal<{ value: number; y: number }[]>([]);
  maxVal = signal(1);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events'] || changes['period']) {
      this.buildChart();
    }
  }

  private buildChart(): void {
    const days = this.buildDays();
    const max = Math.max(...days.map((d) => d.value), 1);
    const padded = Math.ceil(max / 50) * 50 + 50;

    const plotW = this.W - this.PAD.left - this.PAD.right;
    const plotH = this.H - this.PAD.top - this.PAD.bottom;

    const pts: ChartPoint[] = days.map((d, i) => ({
      day: d.label,
      value: d.value,
      x: this.PAD.left + (i / Math.max(days.length - 1, 1)) * plotW,
      y: this.PAD.top + (1 - d.value / padded) * plotH,
    }));

    const poly = pts.map((p) => `${p.x},${p.y}`).join(' ');
    const first = pts[0];
    const last = pts[pts.length - 1];
    const bottom = this.H - this.PAD.bottom;
    const areaPoly =
      `${first.x},${bottom} ` + pts.map((p) => `${p.x},${p.y}`).join(' ') + ` ${last.x},${bottom}`;

    const step = padded / 4;
    const yTickList = Array.from({ length: 5 }, (_, i) => ({
      value: Math.round(i * step),
      y: this.PAD.top + (1 - (i * step) / padded) * plotH,
    }));

    this.points.set(pts);
    this.polyline.set(poly);
    this.area.set(areaPoly);
    this.yTicks.set(yTickList);
    this.maxVal.set(padded);
  }

  private buildDays(): { label: string; value: number }[] {
    // For 7d show last 7 days, for 30d show last 30 grouped by day
    const count = this.period;
    const now = new Date();
    const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MONTH_LABELS = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    if (this.period === 7) {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        const label = DAY_LABELS[d.getDay()];
        const dayStr = d.toISOString().slice(0, 10);
        const value = this.events
          .filter((e) => e.dispensedAt.startsWith(dayStr))
          .reduce((acc, e) => acc + e.amountDispensed, 0);
        return { label, value };
      });
    } else {
      // 30 days — group into 6 blocks of 5 days each for readability
      return Array.from({ length: 6 }, (_, i) => {
        const blockEnd = new Date(now);
        blockEnd.setDate(blockEnd.getDate() - i * 5);
        const blockStart = new Date(blockEnd);
        blockStart.setDate(blockStart.getDate() - 4);

        const label = `${blockStart.getDate()} ${MONTH_LABELS[blockStart.getMonth()]}`;
        const value = this.events
          .filter((e) => {
            const d = new Date(e.dispensedAt);
            return d >= blockStart && d <= blockEnd;
          })
          .reduce((acc, e) => acc + e.amountDispensed, 0);
        return { label, value };
      }).reverse();
    }
  }
}
