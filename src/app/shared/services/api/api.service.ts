import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Rxjs
import { Observable } from 'rxjs';

// Models
import { DataEventsProjection } from '../../models/data-events-projection.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Url for conection API.
  private urlApi = '/data/eventsAPIResponse.json';

  constructor(private http: HttpClient) {}

  // Event projection data
  getEventProjection(): Observable<DataEventsProjection> {
    return this.http.get<DataEventsProjection>(this.urlApi);
  }
}
