import { SupplyType } from './supply-type.model';

export type DispenseTrigger = 'app' | 'manual';

export class DispenserEvent {
  id: number;
  dispensatorId: number;
  scheduleId: number | null;
  trigger: DispenseTrigger;
  supplyType: SupplyType | null;
  amountDispensed: number;
  dispensedAt: string;

  constructor(data: Partial<DispenserEvent> = {}) {
    this.id = data.id ?? 0;
    this.dispensatorId = data.dispensatorId ?? 0;
    this.scheduleId = data.scheduleId ?? null;
    this.trigger = data.trigger ?? 'app';
    this.supplyType = data.supplyType ?? SupplyType.Other;
    this.amountDispensed = data.amountDispensed ?? 0;
    this.dispensedAt = data.dispensedAt ?? '';
  }
}
