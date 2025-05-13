import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCheckboxModule } from '@angular/material/checkbox';

// Services
import { EventsProjectionService } from '../../shared/services/eventsProjection/events-projection.service';

// Rxjs
import { Subscription } from 'rxjs';

// Interfaces
import { DataEventsProjection } from '../../shared/models/data-events-projection.model';
import { DataEventsTableChart } from '../../shared/models/data-events-table-chart.model';

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
  dateToday: Date = new Date();
  dataCycles?: DataEventsTableChart;
  selectedCycleNames: string[] = [];

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

  // Change collapse
  alterExpand() {
    this.expanded = !this.expanded;
  }

  getDataEvents() {
    this.subscription = this.eventsProjectionService.data$.subscribe(
      (data: { quantityEntity: number; projections: DataEventsProjection }) => {
        if (data?.quantityEntity && data?.projections) {
          this.dataCycles =
            this.eventsProjectionService?.getDataForChartAndTable(
              data?.quantityEntity,
              data?.projections
            );

          console.log(this.dataCycles);

          // Automatically mark allocated cycles
          this.selectedCycleNames = this.dataCycles.table
            .filter((t: any) => parseInt(t.selected.split('/')[0], 10) > 0)
            .map((t: any) => t.name);

          this.eventsProjectionService.setDataProjetions(this.dataCycles.chart);
          this.cdr.detectChanges();
          console.log(this.dataCycles);
        }
      }
    );
  }

  /**
   * Verified in cycles based on initiated entities.
   */
  isCycleSelected(name: string): boolean {
    return this.selectedCycleNames.includes(name);
  }

  /**
   * Alter checked cycles.
   */
  toggleCycle(cycle: any) {
    const index = this.selectedCycleNames.indexOf(cycle.name);
    if (index >= 0) {
      this.selectedCycleNames.splice(index, 1);
    } else {
      this.selectedCycleNames.push(cycle.name);
    }
  }
}
