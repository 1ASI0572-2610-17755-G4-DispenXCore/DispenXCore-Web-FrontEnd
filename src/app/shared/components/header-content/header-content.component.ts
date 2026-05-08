import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButtonModule } from "@angular/material/button";
import { LanguageSwitcherComponent } from '../language-swichter/language-switcher.component';

/**
 * Header content component for the application layout.
 * Displays toolbar controls, language switcher and handles menu toggle on mobile.
 */
@Component({
  selector: 'app-header-content',
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatButtonModule,
    LanguageSwitcherComponent
  ],
  templateUrl: './header-content.component.html',
  styleUrl: './header-content.component.css'
})
export class HeaderContentComponent {
  /**
   * Indicates if the layout is in mobile view.
   */
  @Input() isMobile: boolean = false;

  /**
   * Emits when the mobile menu button is clicked.
   */
  @Output() menuToggle = new EventEmitter<void>();
}
