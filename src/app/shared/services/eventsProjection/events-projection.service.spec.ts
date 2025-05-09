import { TestBed } from '@angular/core/testing';

import { EventsProjectionService } from './events-projection.service';

describe('EventsProjectionService', () => {
  let service: EventsProjectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsProjectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
