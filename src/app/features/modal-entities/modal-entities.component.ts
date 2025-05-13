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
  formSubmit: boolean = false;
  dataEventsChart!: {
    quantityEntity: number;
    projections: DataEventsProjection;
  };
  totalAvailable: number = 1;

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
    this.getAvaibleEntities();
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
        this.cdr.detectChanges(); // Checking changes in angular

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

  getAvaibleEntities() {
    this.subscription = this.eventsProjectionService.totalAvailable$.subscribe(
      (total) => {
        if (total) {
          this.totalAvailable = total;
          console.log('Total received in parent:', total);
        }
      }
    );
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
    if (this.formSubmit) {
      this.formControls['quantityEntities'].setValue(1);
      this.dataEventsChart.quantityEntity = 1;
      this.eventsProjectionService.setData(this.dataEventsChart);
      this.toastrFeedbackService.toast(
        '',
        `O gráfico e os ciclos foram restaurados para os valores padrão do dia ${this.getDayWeek()}.`,
        'success'
      );
    }
  }

  onSubmit() {
    if (this.form.valid) {
      let quantityEntity = this.formControls['quantityEntities'].value;
      if (quantityEntity <= this.totalAvailable) {
        this.formSubmit = true;
        this.dataEventsChart.quantityEntity = quantityEntity;
        this.eventsProjectionService.setData(this.dataEventsChart);

        if (quantityEntity > 1) {
          this.toastrFeedbackService.toast(
            '',
            `${quantityEntity} entidade${
              quantityEntity > 1 ? 's' : ''
            } iniciada${quantityEntity > 1 ? 's' : ''} com sucesso!`,
            'success'
          );
        }
      } else {
        this.toastrFeedbackService.toast(
          'Valor inválido!',
          `É possível iniciar até ${this.totalAvailable} entidade${
            this.totalAvailable > 1 ? 's' : ''
          }, de acordo com os ciclos disponíveis.`,
          'info'
        );
      }
    } else {
      this.toastrFeedbackService.toast(
        'Valor inválido!',
        'É necessário informar um valor igual ou maior que 1 para iniciar uma entidade.',
        'warning'
      );
    }
  }
}
