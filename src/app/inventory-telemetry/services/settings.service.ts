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
    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http.get<Device>(this.deviceUrl);

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http
    //   .get<DeviceResponse>(this.deviceUrl)
    //   .pipe(map(r => r.data));
  }

  updateDevice(request: UpdateDeviceRequest): Observable<Device> {
    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http.patch<Device>(this.deviceUrl, request, this.httpOptions);

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http
    //   .patch<DeviceResponse>(this.deviceUrl, request, this.httpOptions)
    //   .pipe(map(r => r.data));
  }

  // ── Firmware ─────────────────────────────────────────────────────────────────

  getFirmwareList(): Observable<Firmware[]> {
    // ── JSON-SERVER (mock) ────────────────────────────────────────────────
    return this.http.get<Firmware[]>(this.firmwareUrl);

    // ── REAL BACKEND ──────────────────────────────────────────────────────
    // return this.http
    //   .get<FirmwareListResponse>(this.firmwareUrl)
    //   .pipe(map(r => r.data));
  }

  getLatestFirmware(): Observable<Firmware | null> {
    return this.getFirmwareList().pipe(
      map((list) => list.find((f) => f.isLatest) ?? list[0] ?? null),
    );
  }
}
