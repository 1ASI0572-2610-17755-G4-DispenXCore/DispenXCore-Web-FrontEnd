import { DispenserEvent } from '../entities/dispenserEvent.entity';

export class DispenserEventListResponse {
  constructor(
    public data: DispenserEvent[],
    public total: number,
    public totalAmountKg: number,
  ) {}
}
