import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EventsProjectionService } from '../../shared/services/eventsProjection/events-projection.service';
import { Subscription } from 'rxjs';
import { DataEventsProjection } from '../../shared/models/data-events-projection.model';
import { Cycles } from '../../shared/models/cycles.model';
import { StructureCycles } from '../../shared/models/structure-cycles.model';

@Component({
  selector: 'app-cyles',
  templateUrl: './cyles.component.html',
  styleUrl: './cyles.component.scss',
  imports: [CommonModule, MatCheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CylesComponent implements OnInit, OnDestroy {
  expanded: boolean = true;
  subscription!: Subscription;
  dataEvents!: { quantityEntity: number; projections: DataEventsProjection };
  cycles!: Cycles[];
  dateToday: Date = new Date();
  dataCycles: any;
  ciclosSelecionadosNomes: string[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private eventsProjectionService: EventsProjectionService
  ) {}

  ngOnInit(): void {
    // setTimeout(() => {
    this.getDataEvents();
    // }, 1000);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // change collapse
  alterExpand() {
    this.expanded = !this.expanded;
  }

  getDataEvents() {
    this.subscription = this.eventsProjectionService.data$.subscribe(
      (data: { quantityEntity: number; projections: DataEventsProjection }) => {
        console.log(data);
        if (data?.quantityEntity && data?.projections) {
          this.dataCycles =
            this.eventsProjectionService?.getDadosParaGraficoELista(
              data?.quantityEntity,
              data?.projections
            );

          // Marcar automaticamente ciclos que foram alocados
          this.ciclosSelecionadosNomes = this.dataCycles.tabela
            .filter((t: any) => t.selecionados.startsWith('1')) // ou > 0, dependendo de como deseja marcar
            .map((t: any) => t.nome);
          this.cdr.detectChanges();
          console.log(this.dataCycles);
        }
      }
    );
  }

  cicloSelecionado(nome: string): boolean {
    return this.ciclosSelecionadosNomes.includes(nome);
  }

  toggleCiclo(ciclo: any) {
    const index = this.ciclosSelecionadosNomes.indexOf(ciclo.nome);
    if (index >= 0) {
      this.ciclosSelecionadosNomes.splice(index, 1);
    } else {
      this.ciclosSelecionadosNomes.push(ciclo.nome);
    }
  }
}
