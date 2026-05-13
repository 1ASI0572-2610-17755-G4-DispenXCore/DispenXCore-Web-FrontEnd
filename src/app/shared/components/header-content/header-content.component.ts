import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-swichter/language-switcher.component';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';
import { NotificationDropdownComponent } from '../notifications-dropdown/notifications-dropdown.component';

interface SearchResult {
  label: string;
  route: string;
}

@Component({
  selector: 'app-header-content',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    LanguageSwitcherComponent,
    NotificationDropdownComponent,
    UserDropdownComponent,
  ],
  templateUrl: './header-content.component.html',
  styleUrl: './header-content.component.css',
})
export class HeaderContentComponent {
  @Input() isMobile: boolean = false;
  @Output() menuToggle = new EventEmitter<void>();

  private router = inject(Router);
  private elRef = inject(ElementRef);

  searchQuery = signal('');
  searchResults = signal<SearchResult[]>([]);
  showResults = signal(false);

  private searchIndex: SearchResult[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Device Overview', route: '/dashboard' },
    { label: 'Stock Inventory', route: '/dashboard' },
    { label: 'Schedule', route: '/schedule' },
    { label: 'Schedule Management', route: '/schedule' },
    { label: 'New Schedule', route: '/schedule' },
    { label: 'Feeding Routines', route: '/schedule' },
    { label: 'History', route: '/history' },
    { label: 'Dispensing History', route: '/history' },
    { label: 'Event Log', route: '/history' },
    { label: 'Export CSV', route: '/history' },
    { label: 'Settings', route: '/settings' },
    { label: 'Device Configuration', route: '/settings' },
    { label: 'Notifications', route: '/settings' },
    { label: 'Firmware', route: '/settings' },
    { label: 'WiFi', route: '/settings' },
    { label: 'Support', route: '/support' },
    { label: 'Help Center', route: '/support' },
    { label: 'FAQ', route: '/support' },
    { label: 'Contact', route: '/support' },
  ];

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);

    if (value.trim().length < 2) {
      this.searchResults.set([]);
      this.showResults.set(false);
      return;
    }

    const lower = value.toLowerCase();
    const results = this.searchIndex.filter((item) => item.label.toLowerCase().includes(lower));
    this.searchResults.set(results);
    this.showResults.set(results.length > 0);
  }

  onSelectResult(result: SearchResult) {
    this.router.navigate([result.route]);
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showResults.set(false);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showResults.set(false);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showResults.set(false);
    }
  }
}
