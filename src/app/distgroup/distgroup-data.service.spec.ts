import { TestBed } from '@angular/core/testing';

import { DistgroupDataService } from './distgroup-data.service';

describe('DistgroupDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DistgroupDataService = TestBed.get(DistgroupDataService);
    expect(service).toBeTruthy();
  });
});
