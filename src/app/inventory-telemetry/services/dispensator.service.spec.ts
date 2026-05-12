import { TestBed } from '@angular/core/testing';

import { DispensatorService } from './dispensator.service';

describe('DispensatorService', () => {
  let service: DispensatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispensatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
