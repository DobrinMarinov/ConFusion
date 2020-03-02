import { TestBed } from '@angular/core/testing';

import { ProcessHttpMessageService } from './process-http-message.service';

describe('ProcessHttpMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessHttpMessageService = TestBed.get(ProcessHttpMessageService);
    expect(service).toBeTruthy();
  });
});
