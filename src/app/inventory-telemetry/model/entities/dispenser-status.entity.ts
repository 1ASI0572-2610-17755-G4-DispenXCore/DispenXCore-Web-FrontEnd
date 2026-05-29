export class DispenserStatus {
  id: number;
  dispensatorId: number;
  isActive: boolean;
  currentCapacity: number;
  maxCapacity: number;
  dailyTotal: number;
  nextDispenseAt: string;

  constructor(data: Partial<DispenserStatus> = {}) {
    this.id = data.id ?? 0;
    this.dispensatorId = data.dispensatorId ?? 0;
    this.isActive = data.isActive ?? false;
    this.currentCapacity = data.currentCapacity ?? 0;
    this.maxCapacity = data.maxCapacity ?? 0;
    this.dailyTotal = data.dailyTotal ?? 0;
    this.nextDispenseAt = data.nextDispenseAt ?? '';
  }

  /** Porcentaje de capacidad actual (0-100) */
  get levelPercent(): number {
    if (!this.maxCapacity) return 0;
    return Math.round((this.currentCapacity / this.maxCapacity) * 100);
  }

  /** Peso actual en kg */
  get weightKg(): number {
    return +(this.currentCapacity / 1000).toFixed(1);
  }
}
