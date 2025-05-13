import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// Angular Material
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

// Components
import { ModalEntitiesComponent } from '../modal-entities/modal-entities.component';

// Services
import { ApiService } from '../../shared/services/api/api.service';

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
      disableClose: true, // Prevents modal from closing when clicking outside.
    });
  }
}
