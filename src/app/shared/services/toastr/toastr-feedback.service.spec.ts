import { TestBed } from '@angular/core/testing';

import { ToastrFeedbackService } from './toastr-feedback.service';

describe('ToastrFeedbackService', () => {
  let service: ToastrFeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrFeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
