import { Device } from '../entities/device.entity';
import { Firmware } from '../entities/firmware.entity';

export class DeviceResponse {
  constructor(
    public data: Device,
    public message: string,
  ) {}
}

export class FirmwareResponse {
  constructor(
    public data: Firmware,
    public message: string,
  ) {}
}

export class FirmwareListResponse {
  constructor(
    public data: Firmware[],
    public total: number,
  ) {}
}
