import { TestBed } from '@angular/core/testing';

import { NodeAvailabilityDataService } from './node-availability-data.service';

describe('NodeAvailabilityDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeAvailabilityDataService = TestBed.get(NodeAvailabilityDataService);
    expect(service).toBeTruthy();
  });
});
