import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DispenserStatus } from '../../inventory-telemetry/model/entities/dispenser-status.entity';
import { Dispensator } from '../../inventory-telemetry/model/entities/dispensator.entity';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private statusUrl = `${environment.apiBaseUrl}${environment.dispensatorStatusPath}`;
  private dispensatorsUrl = `${environment.apiBaseUrl}${environment.dispensatorsPath}`;

  private http = inject(HttpClient);


  getStatusByDispensator(dispensatorId: number): Observable<DispenserStatus> {
    return this.http
      .get<DispenserStatus>(`${this.statusUrl}/${dispensatorId}`)
      .pipe(map((data) => new DispenserStatus(data)));
  }

  getDispensators(): Observable<Dispensator[]> {
    return this.http
      .get<Dispensator[]>(this.dispensatorsUrl)
      .pipe(map((list) => list.map((d) => new Dispensator(d))));
  }
}
