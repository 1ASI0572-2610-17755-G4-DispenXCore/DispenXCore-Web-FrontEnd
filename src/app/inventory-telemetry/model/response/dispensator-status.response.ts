export class DispensatorStatusResponse {
  constructor(
    public dispensatorId: number,
    public isActive: boolean,
    public currentCapacity: number,
    public maxCapacity: number,
    public dailyTotal: number,
    public nextDispenseAt: string | null,
  ) {}
}
