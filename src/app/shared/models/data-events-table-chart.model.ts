export interface Events {
  day: number;
  meetings: number;
  emails: number;
  calls: number;
  follows: number;
}

export interface EventsTable {
  available: number;
  name: string;
  priority: string;
  selected: string;
  todayEvents: Events[];
  totalEvents: number
}

export interface DataEventsTableChart {
  chart: Events[] | any;
  cyclesWithAvailability: number;
  cyclesWithoutAvailability: number;
  table: EventsTable[];
}
