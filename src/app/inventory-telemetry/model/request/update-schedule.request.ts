import { SupplyType } from '../entities/supply-type.model';

export class UpdateScheduleRequest {
  constructor(
    public name?: string,
    public supplyType?: SupplyType,
    public amount?: number,
    public scheduledTime?: string,
    public frequencyDays?: number[],
    public smartRefill?: boolean,
    public isActive?: boolean,
  ) {}
}
