import { Component, OnDestroy, OnInit } from '@angular/core';

// Chart
import Chart from 'chart.js/auto';

// RXJS
import { Subscription } from 'rxjs';

// Enums
import { DayWeek } from '../../shared/enums/day-week.enum';

// Interfaces
import { EventsProjection } from '../../shared/models/events-projection.model';
import { Events } from '../../shared/models/data-events-table-chart.model';

// Services
import { EventsProjectionService } from '../../shared/services/eventsProjection/events-projection.service';

@Component({
  selector: 'app-event-chart',
  imports: [],
  templateUrl: './event-chart.component.html',
  styleUrl: './event-chart.component.scss',
})
export class EventChartComponent implements OnInit, OnDestroy {
  chartInstance: Chart | any = null;
  dataEvents!: Events[];
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

  /**
   * Receiving the data to build the graph.
   */
  getDataEvents() {
    this.subscription =
      this.eventsProjectionService.eventsProjection$.subscribe((data) => {
        if (data) {
          this.dataEvents = data;
          this.initGraf();
        }
      });
  }

  initGraf() {
    this.projectionUpcomingEents = [];

    this.projectionUpcomingEents =
      this.eventsProjectionService.transformarEventosComData(this.dataEvents);


    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    let currentDay: number = this.currentDate.getDay();

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
