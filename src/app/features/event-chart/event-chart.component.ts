import { Component, OnInit } from '@angular/core';
// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-event-chart',
  imports: [],
  templateUrl: './event-chart.component.html',
  styleUrl: './event-chart.component.scss',
})
export class EventChartComponent implements OnInit {
  chartInstance: Chart | any = null;

  dataGrafico = [
    {
      mes: 'Janeiro',
      mediaDiasParaAnalise: 5.2,
      interacoes: 12,
      interacoesComite: 3,
    },
    {
      mes: 'Fevereiro',
      mediaDiasParaAnalise: 6.8,
      interacoes: 15,
      interacoesComite: 4,
    },
    {
      mes: 'Março',
      mediaDiasParaAnalise: 4.5,
      interacoes: 10,
      interacoesComite: 2,
    },
    {
      mes: 'Abril',
      mediaDiasParaAnalise: 7.1,
      interacoes: 18,
      interacoesComite: 5,
    },
    {
      mes: 'Maio',
      mediaDiasParaAnalise: 5.9,
      interacoes: 14,
      interacoesComite: 3,
    },
    {
      mes: 'Junho',
      mediaDiasParaAnalise: 6.3,
      interacoes: 17,
      interacoesComite: 6,
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.initGraf();
  }

  initGraf() {
    const grafico = document.getElementById('grafico') as HTMLCanvasElement;

    this.chartInstance = new Chart(grafico, {
      type: 'bar',
      options: {
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
          },
        },
      },
      data: {
        labels: this.dataGrafico.map((row) => row.mes),
        datasets: [
          {
            label: `Encontros`,
            data: this.dataGrafico.map(
              (row) => +row.mediaDiasParaAnalise.toFixed(2)
            ),
            backgroundColor: ['#418cf0'],
          },
          {
            label: `Mensagens`,
            data: this.dataGrafico.map((row) => +row.interacoes.toFixed(2)),
            backgroundColor: ['#fcb441'],
          },
          {
            label: `Checkpoints`,
            data: this.dataGrafico.map(
              (row) => +row.interacoesComite.toFixed(2)
            ),
            backgroundColor: ['#e0400a'],
          },
        ],
      },
    });
  }
}
