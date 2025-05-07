import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CylesComponent } from "../cyles/cyles.component";
import { EventChartComponent } from "../event-chart/event-chart.component";

@Component({
  selector: 'app-modal-entities',
  imports: [MatDialogModule, CylesComponent, EventChartComponent],
  templateUrl: './modal-entities.component.html',
  styleUrl: './modal-entities.component.scss',
})
export class ModalEntitiesComponent {
  constructor(private dialogRef: MatDialogRef<ModalEntitiesComponent>) {}

  closeModal() {
    this.dialogRef.close();
  }
}
