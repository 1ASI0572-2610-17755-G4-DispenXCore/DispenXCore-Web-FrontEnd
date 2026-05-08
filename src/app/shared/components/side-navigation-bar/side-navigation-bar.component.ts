import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-side-navigation-bar',
  imports: [
    MatIcon,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    TranslatePipe
  ],
  templateUrl: './side-navigation-bar.component.html',
  styleUrl: './side-navigation-bar.component.css'
})
export class SideNavigationBarComponent {
  private readonly router = inject(Router);

  navOptions = [
    { icon: 'dashboard',  label: 'sidebar.dashboard', route: '/dashboard' },
    { icon: 'schedule',   label: 'sidebar.schedule',  route: '/schedule'  },
    { icon: 'history',    label: 'sidebar.history',   route: '/history'   },
    { icon: 'settings',   label: 'sidebar.settings',  route: '/settings'  },
    { icon: 'help',       label: 'sidebar.support',   route: '/support'   },
  ];

  @Output() logout = new EventEmitter<void>();

  onLogout() {
    this.logout.emit();
    this.router.navigate(['/sign-in']);
  }
}
