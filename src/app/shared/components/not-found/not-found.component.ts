import { Component, signal } from '@angular/core'; // Importamos signal
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; // Necesario para estilos dinámicos

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  // Controla si mostramos el Home de soporte o la lista completa
  showAllFaqs = signal(false);

  toggleFaqs() {
    this.showAllFaqs.set(!this.showAllFaqs());
  }

  // Lista extendida para el "View all"
  fullFaqs = [
    { q: 'How do I reset my PetFeeder Pro?', a: 'Locate the reset button at the bottom and hold it for 10 seconds.' },
    { q: "Device shows 'Offline' but Wi-Fi is working?", a: 'Ensure your device is plugged into 2.4GHz network and try re-pairing.' },
    { q: 'How accurate is the grain level sensor?', a: 'Precision margin of +/- 5 grams.' },
    { q: 'Can I schedule multiple feeding times?', a: 'Yes, up to 12 feeding times per day.' },
    { q: 'Is the bowl dishwasher safe?', a: 'Yes, the stainless steel bowl is top-rack dishwasher safe.' },
    { q: 'What happens during a power outage?', a: 'The device uses the backup batteries to maintain the schedule.' },
    { q: 'How do I share access with family?', a: 'Go to Settings > Share Device and enter their email.' }
  ];
}