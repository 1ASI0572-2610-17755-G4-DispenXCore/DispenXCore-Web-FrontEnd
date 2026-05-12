import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryChartComponent } from './history-chart.component';

describe('HistoryChartComponent', () => {
  let component: HistoryChartComponent;
  let fixture: ComponentFixture<HistoryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
