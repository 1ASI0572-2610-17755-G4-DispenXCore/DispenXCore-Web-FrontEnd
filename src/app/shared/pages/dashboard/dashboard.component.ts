import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardService } from '../../services/dashboard.service';
import { DispenserStatus } from '../../../inventory-telemetry/model/entities/dispenser-status.entity';

// ID del dispensador activo — en una app real vendría del AuthService / store
const ACTIVE_DISPENSATOR_ID = 1;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);

  status = signal<DispenserStatus | null>(null);
  isLoading = signal(false);

  // ── Derived metrics ────────────────────────────────────────────────────────

  /** Peso actual en kg calculado desde currentCapacity (gramos) */
  weightKg = computed(() => this.status()?.weightKg ?? 0);

  /** Porcentaje de nivel de grano (0-100) */
  levelPercent = computed(() => this.status()?.levelPercent ?? 0);

  /** Estado de salud según el nivel */
  levelStatus = computed((): 'critical' | 'low' | 'healthy' => {
    const pct = this.levelPercent();
    if (pct <= 15) return 'critical';
    if (pct <= 35) return 'low';
    return 'healthy';
  });

  /** Total dispensado hoy en gramos */
  dailyTotal = computed(() => this.status()?.dailyTotal ?? 0);

  /** Próxima dispensación */
  nextDispense = computed(() => {
    const raw = this.status()?.nextDispenseAt;
    if (!raw) return null;
    return new Date(raw);
  });

  isOnline = computed(() => this.status()?.isActive ?? false);

  ngOnInit(): void {
    this.loadStatus();
  }

  private loadStatus(): void {
    this.isLoading.set(true);
    this.dashboardService.getStatusByDispensator(ACTIVE_DISPENSATOR_ID).subscribe({
      next: (data) => {
        this.status.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onOrderRefill(): void {
    this.router.navigate(['/schedule']);
  }

  onViewHistory(): void {
    this.router.navigate(['/history']);
  }
}
