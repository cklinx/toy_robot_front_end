import { TestBed } from '@angular/core/testing';

import { SharedFuncsService } from './shared-funcs.service';

describe('SharedFuncsService', () => {
  let service: SharedFuncsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedFuncsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});