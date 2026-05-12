import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyTypeBadgeComponent } from './supply-type-badge.component';

describe('SupplyTypeBadgeComponent', () => {
  let component: SupplyTypeBadgeComponent;
  let fixture: ComponentFixture<SupplyTypeBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyTypeBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplyTypeBadgeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
