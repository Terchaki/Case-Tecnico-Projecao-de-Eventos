import { Cycles } from './cycles.model';
import { EventsProjection } from './events-projection.model';

export interface DataEventsProjection {
  eventsProjection: EventsProjection[];
  cycles: Cycles[];
}
