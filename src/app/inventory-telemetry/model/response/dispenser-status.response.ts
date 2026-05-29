import { DispenserStatus } from '../entities/dispenser-status.entity';

export class DispenserStatusResponse {
  constructor(
    public data: DispenserStatus,
    public message: string,
  ) {}
}

export class DispenserStatusListResponse {
  constructor(
    public data: DispenserStatus[],
    public total: number,
  ) {}
}
