import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'DispenXCore';

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('app-lang');
    const browserLang = translate.getBrowserLang();

    const langToUse = savedLang || (browserLang?.match(/en|es/) ? browserLang : 'en');

    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
    this.translate.use(langToUse);
  }
}
