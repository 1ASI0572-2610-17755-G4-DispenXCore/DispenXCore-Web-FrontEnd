import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from '../../services/settings.service';
import { Device } from '../../model/entities/device.entity';
import { Firmware } from '../../model/entities/firmware.entity';
import { UpdateDeviceRequest } from '../../model/request/update device.request';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);

  // UI state
  isReadOnly = signal(true);

  // Device
  device = signal<Device | null>(null);
  isLoadingDevice = signal(false);

  // Firmware
  firmware = signal<Firmware | null>(null);
  isLoadingFirmware = signal(false);

  // Notification settings
  thresholdValue = signal(15);
  pushEnabled = true;
  smsEnabled = false;
  emailEnabled = true;

  // Derived: consider online if lastSeen within 5 minutes
  isOnline = computed(() => {
    const d = this.device();
    if (!d) return false;
    return Date.now() - new Date(d.lastSeen).getTime() < 5 * 60 * 1000;
  });

  ngOnInit(): void {
    this.loadDevice();
    this.loadFirmware();
  }

  private loadDevice(): void {
    this.isLoadingDevice.set(true);
    this.settingsService.getDevice().subscribe({
      next: (data) => {
        this.device.set(data);
        this.isLoadingDevice.set(false);
      },
      error: () => this.isLoadingDevice.set(false),
    });
  }

  private loadFirmware(): void {
    this.isLoadingFirmware.set(true);
    this.settingsService.getLatestFirmware().subscribe({
      next: (data) => {
        this.firmware.set(data);
        this.isLoadingFirmware.set(false);
      },
      error: () => this.isLoadingFirmware.set(false),
    });
  }

  onEdit(): void {
    this.isReadOnly.set(false);
  }

  onCancel(): void {
    this.loadDevice();
    this.isReadOnly.set(true);
  }

  onSave(): void {
    const current = this.device();
    if (current) {
      const request = new UpdateDeviceRequest(current.name, current.location);
      this.settingsService.updateDevice(request).subscribe();
    }
    this.isReadOnly.set(true);
  }
}
