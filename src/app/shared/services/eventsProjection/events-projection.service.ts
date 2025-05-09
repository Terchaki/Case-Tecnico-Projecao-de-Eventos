import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataEventsProjection } from '../../models/data-events-projection.model';

@Injectable({
  providedIn: 'root',
})
export class EventsProjectionService {
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor() {}

  setData(data: { quantityEntity: number; projections: DataEventsProjection }) {
    this.dataSubject.next(data);
  }
}
