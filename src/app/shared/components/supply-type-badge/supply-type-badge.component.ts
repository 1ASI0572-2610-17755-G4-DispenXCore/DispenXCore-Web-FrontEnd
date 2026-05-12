import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SupplyType } from '../../../inventory-telemetry/model/entities/supply-type.model';
import { NgClass } from '@angular/common';

/**
 * Shared component that displays a styled badge for a supply type.
 *
 * @summary
 * Renders a pill-shaped badge with a color and label based on the SupplyType enum.
 * Used in schedule cards and history table rows.
 */
@Component({
  selector: 'app-supply-type-badge',
  standalone: true,
  imports: [TranslateModule, NgClass],
  templateUrl: './supply-type-badge.component.html',
  styleUrl: './supply-type-badge.component.css',
})
export class SupplyTypeBadgeComponent {
  /** The supply type to display. */
  @Input() supplyType!: SupplyType;

  get badgeClass(): string {
    switch (this.supplyType) {
      case SupplyType.Rice:
        return 'badge--rice';
      case SupplyType.Lentils:
        return 'badge--lentils';
      case SupplyType.Beans:
        return 'badge--beans';
      case SupplyType.Corn:
        return 'badge--corn';
      default:
        return 'badge--other';
    }
  }
}
