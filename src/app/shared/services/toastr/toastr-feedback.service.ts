import { Injectable } from '@angular/core';

// Toastr
import { GlobalConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastrFeedbackService {
  toaster: any;
  globalConfig: GlobalConfig;

  constructor(private toastr: ToastrService) {
    this.globalConfig = this.toastr.toastrConfig;
  }

  // Message Toast
  public toast(message: string, titulo: string, typeToaster: string) {
    this.toastr.clear();
    setTimeout(() => {
      this.globalConfig.progressBar = true;
      this.globalConfig.extendedTimeOut = 3000;
      this.globalConfig.positionClass = 'toast-bottom-full-width';
      typeToaster == 'success' ? this.toastr.success(titulo, message) : null;
      typeToaster == 'info' ? this.toastr.info(titulo, message) : null;
      typeToaster == 'warning' ? this.toastr.warning(titulo, message) : null;
      typeToaster == 'error' ? this.toastr.error(titulo, message) : null;
    }, 500);
  }
}
