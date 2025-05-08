import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cyles',
  templateUrl: './cyles.component.html',
  styleUrl: './cyles.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CylesComponent {
  expanded: boolean = false;

  // change collapse
  alterExpand() {
    this.expanded = !this.expanded;
  }
}
