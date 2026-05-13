import { Schedule } from '../entities/schedule.entity';

export class ScheduleResponse {
  constructor(
    public data: Schedule,
    public message: string,
  ) {}
}

export class ScheduleListResponse {
  constructor(
    public data: Schedule[],
    public total: number,
  ) {}
}
