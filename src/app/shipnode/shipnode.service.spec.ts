import { TestBed } from '@angular/core/testing';

import { ShipnodeService } from './shipnode.service';

describe('ShipnodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShipnodeService = TestBed.get(ShipnodeService);
    expect(service).toBeTruthy();
  });
});
