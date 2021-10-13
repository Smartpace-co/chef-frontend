import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  constructor(public toast: ToastrService) {}

  showToast(message, title, type) {
    switch (type) {
      case 'error':
        this.toast.error(message, title);
        break;
      case 'success':
        this.toast.success(message, title);
        break;
      case 'warning':
        this.toast.warning(message, title);
        break;
      case 'info':
        this.toast.info(message, title);
        break;
      default:
        this.toast.show(message, title);
        break;
    }
  }
}
