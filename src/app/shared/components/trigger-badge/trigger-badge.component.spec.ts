import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerBadgeComponent } from './trigger-badge.component';

describe('TriggerBadgeComponent', () => {
  let component: TriggerBadgeComponent;
  let fixture: ComponentFixture<TriggerBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriggerBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TriggerBadgeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
