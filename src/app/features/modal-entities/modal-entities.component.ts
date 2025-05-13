import {
  OnInit,
  OnDestroy,
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';

// Rxjs
import { Subscription } from 'rxjs';

// Services
import { ApiService } from './../../shared/services/api/api.service';
import { ToastrFeedbackService } from '../../shared/services/toastr/toastr-feedback.service';
import { EventsProjectionService } from './../../shared/services/eventsProjection/events-projection.service';

// Angular Material
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

// Components
import { CylesComponent } from '../cyles/cyles.component';
import { EventChartComponent } from '../event-chart/event-chart.component';

// Interface
import { DataEventsProjection } from '../../shared/models/data-events-projection.model';

@Component({
  selector: 'app-modal-entities',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    CylesComponent,
    EventChartComponent,
  ],
  providers: [ApiService, ToastrFeedbackService],
  templateUrl: './modal-entities.component.html',
  styleUrl: './modal-entities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEntitiesComponent implements OnInit, OnDestroy {
  form: FormGroup;
  subscription!: Subscription;
  qualityEventsDay: number = 1;
  currentDay: number = new Date().getDay();
  dataEventsChart!: {
    quantityEntity: number;
    projections: DataEventsProjection;
  };

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ModalEntitiesComponent>,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private toastrFeedbackService: ToastrFeedbackService,
    private eventsProjectionService: EventsProjectionService
  ) {
    /**
     * Init form.
     */
    this.form = this.formBuilder.group(this.validatorsForm());
  }

  ngOnInit(): void {
    this.getDataEventsProjection();
  }

  ngOnDestroy() {
    // Close Modal.
    this.dialogRef.close();

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Getting events data
   */
  getDataEventsProjection() {
    let sumEvents: number = 0;

    this.subscription = this.apiService.getEventProjection().subscribe({
      next: (res) => {
        res.eventsProjection.forEach((element) => {
          // calculation of current business day events
          if (this.currentDay === element.day) {
            Object.values(element.events).forEach((value) => {
              sumEvents += value;
            });
          }
          // calculation of events for the next business day
          else if (this.currentDay === 0 || this.currentDay === 6) {
            let nextDayBusiness = 1;
            if (nextDayBusiness === element.day) {
              Object.values(element.events).forEach((value) => {
                sumEvents += value;
              });
            }
          }
        });
        this.qualityEventsDay = sumEvents;
        this.cdr.detectChanges();

        // Data sent via service to components.
        this.dataEventsChart = {
          quantityEntity: this.formControls['quantityEntities'].value,
          projections: res,
        };
        this.eventsProjectionService.setData(this.dataEventsChart);
      },
      error: (err: HttpErrorResponse) => {
        this.toastrFeedbackService.toast(
          '',
          'Falha ao carregar os dados de eventos!',
          'error'
        );
      },
    });
  }

  /**
   * Day week template
   */
  getDayWeek(): string {
    let week!: string;

    if (this.currentDay === 0 || this.currentDay === 6) {
      week = 'segunda';
    } else {
      week = 'hoje';
    }

    return week;
  }

  /**
   * Validators form:
   */
  validatorsForm() {
    return {
      quantityEntities: [
        1, // initialization default value.
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
    };
  }

  /**
   *  controls form
   */
  get formControls() {
    return this.form.controls;
  }

  /**
   * Allowing values ​​above 1
   */
  checkInput() {
    let valueInput = this.formControls['quantityEntities'].value;

    if (valueInput === 0 || valueInput < 0) {
      this.formControls['quantityEntities'].setValue(1);
    }
  }

  /**
   * Restore Default Data.
   */
  restoreDefaultData() {
    this.formControls['quantityEntities'].setValue(1);
    this.dataEventsChart.quantityEntity = 1;
    this.eventsProjectionService.setData(this.dataEventsChart);
    this.toastrFeedbackService.toast(
      '',
      `O Gráfico e os Ciclos foram restaurados para os seus valores padrões para o dia de ${this.getDayWeek()}.`,
      'success'
    );
  }

  onSubmit() {
    if (this.form.valid) {
      let quantityEntity = this.formControls['quantityEntities'].value;

      this.dataEventsChart.quantityEntity = quantityEntity;
      this.eventsProjectionService.setData(this.dataEventsChart);

      if (quantityEntity > 1) {
        this.toastrFeedbackService.toast(
          '',
          `Foi iniciado ${quantityEntity} entidades! `,
          'success'
        );
      }
    } else {
      this.toastrFeedbackService.toast(
        'Valor inválido!',
        'A entidade só é iniciada com valores a partir de 1.',
        'warning'
      );
    }
  }
}
