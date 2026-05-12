export class Dispensator {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  maxCapacity: number;

  constructor(data: Partial<Dispensator> = {}) {
    this.id = data.id ?? 0;
    this.name = data.name ?? '';
    this.status = data.status ?? 'inactive';
    this.maxCapacity = data.maxCapacity ?? 0;
  }
}
