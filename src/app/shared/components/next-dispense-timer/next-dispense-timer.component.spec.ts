import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextDispenseTimerComponent } from './next-dispense-timer.component';

describe('NextDispenseTimerComponent', () => {
  let component: NextDispenseTimerComponent;
  let fixture: ComponentFixture<NextDispenseTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextDispenseTimerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NextDispenseTimerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
