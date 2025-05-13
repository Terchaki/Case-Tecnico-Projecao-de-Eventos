import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { DayWeek } from '../../shared/enums/day-week.enum';
import { DataEventsProjection } from '../../shared/models/data-events-projection.model';
import { EventsProjection } from '../../shared/models/events-projection.model';
import { EventsProjectionService } from '../../shared/services/eventsProjection/events-projection.service';

@Component({
  selector: 'app-event-chart',
  imports: [],
  templateUrl: './event-chart.component.html',
  styleUrl: './event-chart.component.scss',
})
export class EventChartComponent implements OnInit, OnDestroy {
  chartInstance: Chart | any = null;
  dataEvents!: {
    day: number;
    meetings: number;
    emails: number;
    calls: number;
    follows: number;
  }[];
  subscription!: Subscription;
  currentDate: Date = new Date();
  projectionUpcomingEents!: EventsProjection[];

  constructor(private eventsProjectionService: EventsProjectionService) {}

  ngOnInit(): void {
    this.getDataEvents();
  }

  ngOnDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getDataEvents() {
    this.subscription =
      this.eventsProjectionService.eventsProjection$.subscribe((data) => {
        if (data) {
          console.log(data);
          this.dataEvents = data;
          // console.log(data);
          // this.dataEvents = {
          //   quantityEntity: 1,
          //   projections: {
          //     cycles: [],
          //     eventsProjection: data
          //   },
          //   // eventsProjection: data
          // };
          // console.log(this.dataEvents);
          // this.dataEvents = data;
          this.initGraf();
        }
      });
    // this.subscription = this.eventsProjectionService.data$.subscribe((data) => {
    //   if (data) {
    //     console.log(data);
    //     this.dataEvents = data;
    //     this.initGraf();
    //     console.log(this.dataEvents);
    //   }
    // });
  }

  initGraf() {
    this.projectionUpcomingEents = [];

    // Obtaining the object with the ordering of working days.
    // this.projectionUpcomingEents = this.eventsProjectionService.orderNextEvents(
    //   this.dataEvents
    // );

    this.projectionUpcomingEents =
      this.eventsProjectionService.transformarEventosComData(this.dataEvents);

      console.log(this.projectionUpcomingEents);

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    let currentDay: number = this.currentDate.getDay();

    /**
     * To simulate a specific day in the chart legend,
     * simply uncomment this line and insert the desired day.
     * Ex:
     */
    // currentDay = 3;

    const grafico = document.getElementById('grafico') as HTMLCanvasElement;

    this.chartInstance = new Chart(grafico, {
      type: 'bar',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: {
            position: 'bottom',
            display: true,
            labels: {
              color: '#000',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                const label =
                  this.projectionUpcomingEents[index].day === currentDay
                    ? 'Hoje'
                    : DayWeek[this.projectionUpcomingEents[index].day];
                const data = this.projectionUpcomingEents[index].date;
                return `${label} - ${data?.toLocaleDateString()}`;
              },
            },
          },
          title: {
            position: 'left',
            display: true,
            text: [`Quantidade de Eventos`],
            color: '#9b9b9b',
            fullSize: true,
            padding: {},
            font: {
              size: 12,
            },
          },
        },
        scales: {
          x: {
            stacked: true, // <- Bar stacking X.
            grid: {
              display: false,
            },
          },
          y: {
            stacked: true, // <- Bar stacking Y.
            beginAtZero: true,
          },
        },
      },
      data: {
        labels: this.projectionUpcomingEents.map((row) =>
          currentDay === row.day ? 'Hoje' : DayWeek[row.day]
        ),
        datasets: [
          {
            label: `Reuniões`,
            data: this.projectionUpcomingEents.map(
              (row) => row.events.meetings
            ),
            backgroundColor: ['#40bb72'],
          },
          {
            label: `E-mails`,
            data: this.projectionUpcomingEents.map((row) => row.events.emails),
            backgroundColor: ['#969696'],
          },
          {
            label: `Ligações`,
            data: this.projectionUpcomingEents.map((row) => row.events.calls),
            backgroundColor: ['#5cc5dc'],
          },
          {
            label: `Follows`,
            data: this.projectionUpcomingEents.map((row) => row.events.follows),
            backgroundColor: ['#8689ff'],
          },
        ],
      },
    });
  }
}
