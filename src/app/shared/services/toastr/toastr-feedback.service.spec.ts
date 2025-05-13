import { TestBed } from '@angular/core/testing';
import { ToastrFeedbackService } from './toastr-feedback.service';
import { ToastrModule } from 'ngx-toastr';

describe('ToastrFeedbackService', () => {
  let service: ToastrFeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot()
      ]
    });

    service = TestBed.inject(ToastrFeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
