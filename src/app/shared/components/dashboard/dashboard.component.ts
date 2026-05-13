import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatSlideToggleModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private router = inject(Router); 

  /**
   * Navega al apartado de Schedule
   */
  onOrderRefill(): void {
    this.router.navigate(['/schedule']); 
  }

  /**
   * Navega directamente al apartado de History
   */
  onViewHistory(): void {
    this.router.navigate(['/history']); 
  }
}