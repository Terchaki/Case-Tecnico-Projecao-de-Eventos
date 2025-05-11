export interface EventsProjection {
  day: number;
  date?: Date;
  events: {
    meetings: number;
    emails: number;
    calls: number;
    follows: number;
  };
}
