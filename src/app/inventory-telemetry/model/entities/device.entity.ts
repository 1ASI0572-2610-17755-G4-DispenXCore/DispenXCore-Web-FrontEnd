export class Device {
  id: string;
  name: string;
  model: string;
  location: string;
  serialNumber: string;
  registeredAt: string;
  lastSeen: string;

  constructor(data: Partial<Device> = {}) {
    this.id = data.id ?? '';
    this.name = data.name ?? '';
    this.model = data.model ?? '';
    this.location = data.location ?? '';
    this.serialNumber = data.serialNumber ?? '';
    this.registeredAt = data.registeredAt ?? '';
    this.lastSeen = data.lastSeen ?? '';
  }
}
