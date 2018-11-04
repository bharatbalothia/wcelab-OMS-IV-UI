import { TestBed } from '@angular/core/testing';

import { ShipnodeDataService } from './shipnode-data.service';

describe('ShipnodeDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShipnodeDataService = TestBed.get(ShipnodeDataService);
    expect(service).toBeTruthy();
  });
});
