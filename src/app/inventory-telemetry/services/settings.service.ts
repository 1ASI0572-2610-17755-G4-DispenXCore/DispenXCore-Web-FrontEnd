import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Device } from '../model/entities/device.entity';
import { Firmware } from '../model/entities/firmware.entity';
import { UpdateDeviceRequest } from '../model/request/update device.request';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private deviceUrl = `${environment.apiBaseUrl}${environment.devicePath}`;
  private firmwareUrl = `${environment.apiBaseUrl}${environment.firmwarePath}`;

  private http = inject(HttpClient);

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  // ── Device ───────────────────────────────────────────────────────────────────

  getDevice(): Observable<Device> {
    return this.http.get<Device>(this.deviceUrl);
  }

  updateDevice(request: UpdateDeviceRequest): Observable<Device> {
    return this.http.patch<Device>(this.deviceUrl, request, this.httpOptions);
  }

  // ── Firmware ─────────────────────────────────────────────────────────────────

  getFirmwareList(): Observable<Firmware[]> {
    return this.http.get<Firmware[]>(this.firmwareUrl);
  }

  getLatestFirmware(): Observable<Firmware | null> {
    return this.http
      .get<Firmware>(`${this.firmwareUrl}/latest`)
      .pipe(map((f) => f ?? null));
  }
}
