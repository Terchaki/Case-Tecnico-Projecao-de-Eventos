import { ApiService } from '../../shared/services/api/api.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ModalEntitiesComponent } from '../modal-entities/modal-entities.component';

@Component({
  selector: 'app-home',
  imports: [MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  constructor(private dialog: MatDialog, private apiService: ApiService) {}

  ngOnInit() {}

  openModal() {
    this.dialog.open(ModalEntitiesComponent, {
      width: '800px',
      disableClose: true, // Prevents modal from closing when clicking outside.
    });
  }
}
