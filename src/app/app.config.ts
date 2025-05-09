import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog'; // Importando MatDialogModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideToastr(),
    provideClientHydration(withEventReplay()),

    // Using importProvidersFrom for import MatDialogModule and BrowserAnimationsModule
    importProvidersFrom(MatDialogModule),
    importProvidersFrom(BrowserAnimationsModule),
  ],
};
