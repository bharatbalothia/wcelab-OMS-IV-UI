import { TestBed } from '@angular/core/testing';

import { AvailabilityDataService } from './availability-data.service';

describe('AvailabilityDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AvailabilityDataService = TestBed.get(AvailabilityDataService);
    expect(service).toBeTruthy();
  });
});
