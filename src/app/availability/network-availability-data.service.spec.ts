import { TestBed } from '@angular/core/testing';

import { NetworkAvailabilityDataService } from './network-availability-data.service';

describe('NetworkAvailabilityDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkAvailabilityDataService = TestBed.get(NetworkAvailabilityDataService);
    expect(service).toBeTruthy();
  });
});
