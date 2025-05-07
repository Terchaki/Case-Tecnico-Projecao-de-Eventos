import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CylesComponent } from './cyles.component';

describe('CylesComponent', () => {
  let component: CylesComponent;
  let fixture: ComponentFixture<CylesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CylesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
