import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataEventsProjection } from '../../models/data-events-projection.model';
import { EventsProjection } from '../../models/events-projection.model';

@Injectable({
  providedIn: 'root',
})
export class EventsProjectionService {
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor() {}

  // Method to send data to another component.
  setData(data: { quantityEntity: number; projections: DataEventsProjection }) {
    this.dataSubject.next(data);
  }

  /**
   * Ordering of latest events by working days.
   */
  orderNextEvents(events: {
    quantityEntity: number;
    projections: DataEventsProjection;
  }): EventsProjection[] | any {
    let today = new Date().getDay();
    /**
     * To simulate a day to order the next days on the chart,
     * simply uncomment this line and insert the desired day.
     * Ex:
     */
    // today = 3;

    // Taking the current business day or the next one if today is Saturday or Sunday.
    let businessDay = today === 0 || today === 6 ? 1 : today;

    const daysWeek: number[] = [];

    // Get days object.
    events.projections.eventsProjection.forEach((obj) => {
      daysWeek.push(obj.day);
    });

    // Get position current day.
    const currentDayPositionsList = daysWeek.indexOf(businessDay);

    // Ordering the current day as first.
    const nextDaysOrder = [
      ...daysWeek.slice(currentDayPositionsList),
      ...daysWeek.slice(0, currentDayPositionsList),
    ];

    const listNextDaysOrder: EventsProjection[] = nextDaysOrder.flatMap(
      (day) => {
        // Find the current or next business day.
        const found = events.projections.eventsProjection.find(
          (e) => e.day === day
        );
        return found ? [found] : [];
      }
    );

    // const todayDate = new Date(this.currentDate); // base
    // let daysAdded = 0;

    // const listNextDaysOrder: EventsProjection[] = nextDaysOrder.flatMap((day) => {
    //   const found = this.dataEvents.projections.eventsProjection.find(
    //     (e) => e.day === day
    //   );

    //   if (found) {
    //     // Pula fins de semana enquanto calcula a próxima data
    //     let futureDate = new Date(todayDate);
    //     let added = 0;
    //     while (added <= daysAdded) {
    //       futureDate.setDate(futureDate.getDate() + 1);
    //       const dayOfWeek = futureDate.getDay();
    //       if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    //         added++;
    //       }
    //     }

    //     found.date = futureDate;
    //     daysAdded++;
    //     return [found];
    //   }

    //   return [];
    // });

    // console.log(listNextDaysOrder);

    // return listNextDaysOrder;

    // Including future dates in the object based on today's (current) date.
    const dateBusiness = new Date();
    for (let index = 0; index < listNextDaysOrder.length; index++) {
      while (dateBusiness.getDay() === 0 || dateBusiness.getDay() === 6) {
        if (dateBusiness.getDay() === 0) {
          dateBusiness.setDate(dateBusiness.getDate() + 1);
        } else {
          dateBusiness.setDate(dateBusiness.getDate() + 2);
        }
      }

      listNextDaysOrder[index].date = new Date(dateBusiness);

      if (dateBusiness.getDay() === 5) {
        dateBusiness.setDate(dateBusiness.getDate() + 3);
      } else {
        dateBusiness.setDate(dateBusiness.getDate() + 1);
      }
    }
    console.log(listNextDaysOrder);

    return listNextDaysOrder;
  }
}
