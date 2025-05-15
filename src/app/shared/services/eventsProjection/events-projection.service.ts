import { Injectable } from '@angular/core';

// Rxjs
import { BehaviorSubject } from 'rxjs';

// Interfaces
import {
  DataEventsTableChart,
  Events,
} from '../../models/data-events-table-chart.model';
import { DataEventsProjection } from '../../models/data-events-projection.model';
import { EventsProjection } from '../../models/events-projection.model';

@Injectable({
  providedIn: 'root',
})
export class EventsProjectionService {
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  private eventsProjectionSubject = new BehaviorSubject<any>(null);
  eventsProjection$ = this.eventsProjectionSubject.asObservable();

  private totalAvailableSubject = new BehaviorSubject<number>(0);
  totalAvailable$ = this.totalAvailableSubject.asObservable();

  constructor() {}

  // Method to send data to the Cycle.
  setData(data: { quantityEntity: number; projections: DataEventsProjection }) {
    this.dataSubject.next(data);
  }

  // Method to send data to the graphical component.
  setDataProjetions(data: {
    day: number;
    meetings: number;
    emails: number;
    calls: number;
    follows: number;
  }) {
    this.eventsProjectionSubject.next(data);
  }

  /**
   * method to send the total number of available entities.
   */
  updateTotalAvailable(total: number): void {
    this.totalAvailableSubject.next(total);
  }

  /**
   * Method for calculating cycle table and graph data.
   */
  transformarEventosComData(
    data: {
      day: number;
      meetings: number;
      emails: number;
      calls: number;
      follows: number;
    }[]
  ): EventsProjection[] {
    const today = new Date();

    const isDiaUtil = (date: Date): boolean => {
      const dayWeek = date.getDay();
      return dayWeek >= 1 && dayWeek <= 5;
    };

    // Ordenar os dados para começar do day 2 (hoje), seguindo em ordem circular
    const dateOrder = [...data];
    const indexToday = dateOrder.findIndex((d) => d.day === today.getDay()); // day 2 é hoje

    const dadosReordenados = [
      ...dateOrder.slice(indexToday),
      ...dateOrder.slice(0, indexToday),
    ];

    // Gerar os próximos 5 dias úteis a partir de hoje
    const diasUteis: Date[] = [];
    const cursor = new Date(today);

    while (diasUteis.length < 5) {
      if (isDiaUtil(cursor)) {
        diasUteis.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    // Associar as datas aos dados reordenados
    return dadosReordenados.map((item, index) => ({
      day: item.day,
      date: diasUteis[index],
      events: {
        meetings: item.meetings,
        emails: item.emails,
        calls: item.calls,
        follows: item.follows,
      },
    }));
  }

  /**
   * Method that returns the processed data for assembling the graph and cycle table.
   */
  getDataForChartAndTable(
    quantityEntity: number,
    projections: DataEventsProjection
  ): DataEventsTableChart {
    const getCurrentWeekday = (): number => {
      const weekday = new Date().getDay(); // 0 (Sun) to 6 (Sat)
      if (weekday >= 1 && weekday <= 5) {
        return weekday;
      }
      return 1; // If weekend, return Monday
    };

    const currentWeekday = getCurrentWeekday();

    // Sort cycles by priority
    const priorityMap: any = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    const sortedCycles: any = [...projections?.cycles].sort(
      (a, b) => priorityMap[a.priority] - priorityMap[b.priority]
    );

    const selectedCycles: any[] = [];
    let remainingEntities = quantityEntity;

    for (const cycle of sortedCycles) {
      if (remainingEntities === 0) break;
      const entitiesForThisCycle = Math.min(
        cycle.availableEntities,
        remainingEntities
      );
      if (entitiesForThisCycle > 0) {
        selectedCycles.push({
          ...cycle,
          selectedEntities: entitiesForThisCycle,
        });
        remainingEntities -= entitiesForThisCycle;
      }
    }

    // Update projections with allocated entities
    const finalChart: Events[] = projections.eventsProjection.map((proj) => {
      const events = { ...proj.events };
      selectedCycles.forEach((cycle) => {
        const dayStructure = cycle.structure.find(
          (d: any) => d.day === proj.day
        );
        if (dayStructure) {
          events.meetings += dayStructure.meetings * cycle.selectedEntities;
          events.emails += dayStructure.emails * cycle.selectedEntities;
          events.calls += dayStructure.calls * cycle.selectedEntities;
          events.follows += dayStructure.follows * cycle.selectedEntities;
        }
      });

      return {
        day: proj.day,
        ...events,
      };
    });

    // Build the table with priorities, today’s events, and totals
    const cycleTable = sortedCycles.map((c: any) => {
      const selectedCycle = selectedCycles.find((sc) => sc.name === c.name);
      const selectedEntities = selectedCycle?.selectedEntities || 0;

      const todayEvents = c.structure.find(
        (s: any) => s.day === currentWeekday
      ) || {
        meetings: 0,
        emails: 0,
        calls: 0,
        follows: 0,
      };

      const totalEvents =
        todayEvents.meetings +
        todayEvents.emails +
        todayEvents.calls +
        todayEvents.follows;

      return {
        name: c.name,
        priority: c.priority,
        available: c.availableEntities,
        selected: `${selectedEntities}/${c.availableEntities}`,
        todayEvents,
        totalEvents,
      };
    });

    const cyclesWithAvailability = sortedCycles.filter(
      (c: any) => c.availableEntities > 0
    ).length;

    const cyclesWithoutAvailability = sortedCycles.filter(
      (c: any) => c.availableEntities === 0
    ).length;

    // Storing the total number of entities available to initialize based on available cycles.
    this.updateTotalAvailable(this.getTotalAvailable(cycleTable));

    return {
      chart: finalChart,
      table: cycleTable,
      cyclesWithAvailability,
      cyclesWithoutAvailability,
    };
  }

  // Calculate available entities.
  getTotalAvailable(cycleTable: any): number {
    return cycleTable.reduce(
      (total: any, cycle: any) => total + cycle.available,
      0
    );
  }
}
