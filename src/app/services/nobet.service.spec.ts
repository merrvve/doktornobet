import { TestBed } from '@angular/core/testing';

import { NobetService } from './nobet.service';

describe('NobetService', () => {
  let service: NobetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NobetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
