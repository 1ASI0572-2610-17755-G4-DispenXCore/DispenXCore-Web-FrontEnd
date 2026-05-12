import { Component, Input, OnChanges, SimpleChanges, computed, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DispenserEvent } from '../../model/entities/dispenserEvent.entity';

interface ChartPoint {
  day: string; // label e.g. "Mon"
  value: number; // grams
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

  // SVG viewport
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
    const yTickList = Array.from({ length: 5 }, (_, i) => {
      const val = Math.round(i * step);
      return {
        value: val,
        y: this.PAD.top + (1 - val / padded) * plotH,
      };
    });

    this.points.set(pts);
    this.polyline.set(poly);
    this.area.set(areaPoly);
    this.yTicks.set(yTickList);
    this.maxVal.set(padded);
  }

  private buildDays(): { label: string; value: number }[] {
    const count = this.period === 7 ? 7 : 7; // always show 7-day view on chart
    const now = new Date();
    const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return Array.from({ length: count }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (count - 1 - i));
      const label = DAY_LABELS[d.getDay()];
      const dayStr = d.toISOString().slice(0, 10);
      const value = this.events
        .filter((e) => e.dispensedAt.startsWith(dayStr))
        .reduce((acc, e) => acc + e.amountDispensed, 0);
      return { label, value };
    });
  }
}
