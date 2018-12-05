import { TestBed } from '@angular/core/testing';

import { ReservationDataService } from './reservation-data.service';

describe('ReservationDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReservationDataService = TestBed.get(ReservationDataService);
    expect(service).toBeTruthy();
  });
});
