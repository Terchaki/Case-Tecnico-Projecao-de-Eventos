import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEntitiesComponent } from './modal-entities.component';

describe('ModalEntitiesComponent', () => {
  let component: ModalEntitiesComponent;
  let fixture: ComponentFixture<ModalEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEntitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
