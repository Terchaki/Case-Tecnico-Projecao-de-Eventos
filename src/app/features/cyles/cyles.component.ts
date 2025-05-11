import { Component, ViewEncapsulation } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-cyles',
  templateUrl: './cyles.component.html',
  styleUrl: './cyles.component.scss',
  imports: [CommonModule, MatCheckboxModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CylesComponent {
  expanded: boolean = false;

  // change collapse
  alterExpand() {
    this.expanded = !this.expanded;
  }
}
