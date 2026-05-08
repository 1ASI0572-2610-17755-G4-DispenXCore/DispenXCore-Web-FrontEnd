import { Component, signal } from '@angular/core';
import { SideNavigationBarComponent } from '../side-navigation-bar/side-navigation-bar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterOutlet } from '@angular/router';
import { Authentication } from '../../../user-access/services/authentication.service';
import { HeaderContentComponent } from '../header-content/header-content.component';

@Component({
  selector: 'app-main-layout',
  imports: [HeaderContentComponent, SideNavigationBarComponent, MatSidenavModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  readonly isMobile = signal<boolean>(false);

  constructor(
    private observer: BreakpointObserver,
    private authService: Authentication,
  ) {
    this.observer.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile.set(result.matches);
    });
  }

  logout() {
    this.authService.signOut();
  }
}
