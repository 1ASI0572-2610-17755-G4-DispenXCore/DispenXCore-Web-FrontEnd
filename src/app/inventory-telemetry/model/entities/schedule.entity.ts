import { SupplyType } from './supply-type.model';

export class Schedule {
  id: number;
  dispensatorId: number;
  name: string;
  supplyType: SupplyType;
  amount: number;
  scheduledTime: string;
  frequencyDays: number[];
  smartRefill: boolean;
  isActive: boolean;

  constructor(data: Partial<Schedule> = {}) {
    this.id = data.id ?? 0;
    this.dispensatorId = data.dispensatorId ?? 0;
    this.name = data.name ?? '';
    this.supplyType = data.supplyType ?? SupplyType.Rice;
    this.amount = data.amount ?? 0;
    this.scheduledTime = data.scheduledTime ?? '00:00';
    this.frequencyDays = data.frequencyDays ?? [];
    this.smartRefill = data.smartRefill ?? false;
    this.isActive = data.isActive ?? false;
  }
}
