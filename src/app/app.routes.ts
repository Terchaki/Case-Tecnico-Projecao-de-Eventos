import { Routes } from '@angular/router';

export const routes: Routes = [
  // Initial application loading route
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    // children: [
    //   {
    //     path: 'modal',
    //     outlet: 'modal',
    //     loadComponent: () =>
    //       import('./features/modal-entities/modal-entities.component').then(
    //         (m) => m.ModalEntitiesComponent
    //       ),
    //   },
    // ],
  },
  // Route wildcard .
  {
    path: '**',
    redirectTo: '',
  },
];
