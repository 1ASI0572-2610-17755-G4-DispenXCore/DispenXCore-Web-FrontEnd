import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DispenseTrigger } from '../../../inventory-telemetry/model/entities/dispenserEvent.entity';
import { NgClass } from '@angular/common';

/**
 * Shared component that displays a styled badge for a dispense trigger.
 *
 * @summary
 * Shows whether a dispensing event was triggered by the app (scheduled)
 * or manually by the physical device. Used in the history table.
 */
@Component({
  selector: 'app-trigger-badge',
  standalone: true,
  imports: [TranslateModule, NgClass],
  templateUrl: './trigger-badge.component.html',
  styleUrl: './trigger-badge.component.css',
})
export class TriggerBadgeComponent {
  /** The trigger source to display. */
  @Input() trigger!: DispenseTrigger;

  get badgeClass(): string {
    return this.trigger === 'app' ? 'badge--app' : 'badge--manual';
  }
}
