import { Component, inject, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css',
})
export class SupportComponent {
  showAllFaqs = signal(false);

  private translate = inject(TranslateService);

  constructor() {}

  toggleFaqs() {
    this.showAllFaqs.set(!this.showAllFaqs());
  }

  get fullFaqs(): { q: string; a: string }[] {
    const keys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];
    return keys.map((k) => ({
      q: this.translate.instant(`support.faq.${k}`),
      a: this.translate.instant(`support.faq.${k.replace('q', 'a')}`),
    }));
  }
}
