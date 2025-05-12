import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EventsProjectionService } from '../../shared/services/eventsProjection/events-projection.service';
import { Subscription } from 'rxjs';
import { DataEventsProjection } from '../../shared/models/data-events-projection.model';
import { Cycles } from '../../shared/models/cycles.model';
import { StructureCycles } from '../../shared/models/structure-cycles.model';

@Component({
  selector: 'app-cyles',
  templateUrl: './cyles.component.html',
  styleUrl: './cyles.component.scss',
  imports: [CommonModule, MatCheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CylesComponent implements OnInit, OnDestroy {
  expanded: boolean = true;
  subscription!: Subscription;
  dataEvents!: { quantityEntity: number; projections: DataEventsProjection };
  cycles!: Cycles[];
  dateToday: Date = new Date();

  constructor(
    private cdr: ChangeDetectorRef,
    private eventsProjectionService: EventsProjectionService
  ) {}

  ngOnInit(): void {
    this.getDataEvents();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // change collapse
  alterExpand() {
    this.expanded = !this.expanded;
  }

  getDataEvents() {
    this.cycles = [];

    this.subscription = this.eventsProjectionService.data$.subscribe(
      (data: { quantityEntity: number; projections: DataEventsProjection }) => {
        console.log(data);
        if (data?.projections?.cycles) {
          // Adicionei optional chaining para segurança
          this.dataEvents = data;
          this.cycles = data.projections.cycles

          this.cycles.filter(cycle => {
            return cycle.structure && cycle.structure.some(item => item.day === 1);
          });

          const priorityOrder: {
            HIGH: number;
            MEDIUM: number;
            LOW: number;
          } = { HIGH: 1, MEDIUM: 2, LOW: 3 };

          this.dataEvents.projections.cycles.sort((a, b) => {
            return (
              priorityOrder[a.priority as keyof typeof priorityOrder] -
              priorityOrder[b.priority as keyof typeof priorityOrder]
            );
          });
          this.cdr.detectChanges();
          // console.log(this.dataEvents);
        }
      }
    );
  }

  sumEvents(events: StructureCycles[]): number {
    // console.log(events);
    // let sum = 0;

    // events.filter((el => {
    //   el.
    // }))
    // console.log(sum);
    return 0;
  }
}
