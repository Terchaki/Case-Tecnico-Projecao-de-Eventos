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

  private eventsProjectionSubject = new BehaviorSubject<any>(null);
  eventsProjection$ = this.eventsProjectionSubject.asObservable();

  constructor() {}

  // Method to send data to another component.
  setData(data: { quantityEntity: number; projections: DataEventsProjection }) {
    this.dataSubject.next(data);
  }

  // Method to send data to another component.
  setDataProjetions(data: { quantityEntity: number; projections: DataEventsProjection }) {
    console.log(data);
    this.eventsProjectionSubject.next(data);
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

    return listNextDaysOrder;
  }

  getDadosParaGraficoELista(
    quantityEntity: number,
    projections: DataEventsProjection
  ) {
    const getDiaUtilAtual = (): number => {
      const hoje = new Date();
      const diaSemana = hoje.getDay(); // 0 = domingo, 6 = sábado

      // Conta quantos dias úteis se passaram desde segunda-feira da semana atual
      let contador = 0;
      let diasCorridos = 0;

      while (contador < 5) {
        const data = new Date();
        data.setDate(hoje.getDate() - diasCorridos);
        const dia = data.getDay();
        if (dia >= 1 && dia <= 5) {
          contador++;
        }
        if (data.toDateString() === hoje.toDateString()) {
          break;
        }
        diasCorridos++;
      }

      return contador || 1; // Garante ao menos 1
    };

    const diaUtilAtual = getDiaUtilAtual();

    // Ordenar ciclos por prioridade
    const prioridadeMap: any = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    const ciclosOrdenados: any = [...projections?.cycles].sort(
      (a, b) => prioridadeMap[a.priority] - prioridadeMap[b.priority]
    );

    const ciclosSelecionados: any[] = [];
    let entidadesRestantes = quantityEntity;

    for (const ciclo of ciclosOrdenados) {
      if (entidadesRestantes === 0) break;
      const entidadesParaEsseCiclo = Math.min(
        ciclo.availableEntities,
        entidadesRestantes
      );
      if (entidadesParaEsseCiclo > 0) {
        ciclosSelecionados.push({
          ...ciclo,
          entidadesSelecionadas: entidadesParaEsseCiclo,
        });
        entidadesRestantes -= entidadesParaEsseCiclo;
      }
    }

    // Atualizar projeções somando eventos dos ciclos com entidades alocadas
    const graficoFinal = projections.eventsProjection.map((proj) => {
      const eventos = { ...proj.events };
      ciclosSelecionados.forEach((ciclo) => {
        const estruturaDia = ciclo.structure.find(
          (d: any) => d.day === proj.day
        );
        if (estruturaDia) {
          eventos.meetings +=
            estruturaDia.meetings * ciclo.entidadesSelecionadas;
          eventos.emails += estruturaDia.emails * ciclo.entidadesSelecionadas;
          eventos.calls += estruturaDia.calls * ciclo.entidadesSelecionadas;
          eventos.follows += estruturaDia.follows * ciclo.entidadesSelecionadas;
        }
      });

      return {
        day: proj.day,
        ...eventos,
      };
    });

    // Montar a tabela com prioridade, eventosHoje e total de eventos
    const tabelaCiclos = ciclosOrdenados.map((c: any) => {
      const cicloSelecionado = ciclosSelecionados.find(
        (cs) => cs.name === c.name
      );
      const entidadesSelecionadas =
        cicloSelecionado?.entidadesSelecionadas || 0;

      const eventosHoje = c.structure.find(
        (s: any) => s.day === diaUtilAtual
      ) || {
        meetings: 0,
        emails: 0,
        calls: 0,
        follows: 0,
      };

      const totalEventos =
        eventosHoje.meetings +
        eventosHoje.emails +
        eventosHoje.calls +
        eventosHoje.follows;

      return {
        nome: c.name,
        prioridade: c.priority,
        disponiveis: c.availableEntities,
        selecionados: `${entidadesSelecionadas}/${c.availableEntities}`,
        eventosHoje,
        totalEventos,
      };
    });

    const ciclosComDisponiveis = ciclosOrdenados.filter(
      (c: any) => c.availableEntities > 0
    ).length;
    const ciclosSemDisponiveis = ciclosOrdenados.filter(
      (c: any) => c.availableEntities === 0
    ).length;

    return {
      grafico: graficoFinal,
      tabela: tabelaCiclos,
      ciclosComDisponiveis,
      ciclosSemDisponiveis,
    };
  }
}
