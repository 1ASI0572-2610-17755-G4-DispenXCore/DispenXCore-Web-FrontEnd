export class Firmware {
  id: string;
  version: string;
  releasedAt: string;
  changelog: string;
  isLatest: boolean;
  downloadUrl: string;

  constructor(data: Partial<Firmware> = {}) {
    this.id = data.id ?? '';
    this.version = data.version ?? '';
    this.releasedAt = data.releasedAt ?? '';
    this.changelog = data.changelog ?? '';
    this.isLatest = data.isLatest ?? false;
    this.downloadUrl = data.downloadUrl ?? '';
  }
}
