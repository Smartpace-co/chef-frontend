import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(public translate: TranslateService) {}
  /**
   * Function to set the user language
   */
  setuserlang() {
    this.translate.use('en');
  }

  getStringFromKey(data){
   return this.translate.instant(data);
  }
}
