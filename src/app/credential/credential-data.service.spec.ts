import { TestBed } from '@angular/core/testing';

import { CredentialDataService } from './credential-data.service';

describe('CredentialDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CredentialDataService = TestBed.get(CredentialDataService);
    expect(service).toBeTruthy();
  });
});
