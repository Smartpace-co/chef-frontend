import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  documentClickedTarget: Subject<HTMLElement> = new Subject<HTMLElement>()

  openMenu: boolean = false;
  constructor() { }

  toggleMenu() {
    this.openMenu = !this.openMenu;
  }

  /**
   * Strict compare function
   * @param val1 - value 1
   * @param val2 - value 2
   */
  strictCompare(val1: any, val2: any, strictMode: boolean = true) {
    try {
      let result: boolean;
      if (strictMode) {
        result = val1.toString().toLowerCase() === val2.toString().toLowerCase();
      } else {
        result = val1.toString().toLowerCase() === val2.toString().toLowerCase();
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Format the phone number into :(000)-000-0000 @param number
   */
  // tslint:disable-next-line: variable-name
  formatPhoneNumber(number) {
    try {
      let formattedPhoneNumber;
      formattedPhoneNumber = number.replace(/\D\-+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1)-$2-$3');
      return formattedPhoneNumber;
    } catch (error) {
      throw error;
    }
  }

  /**
   * To calculate time between 2 dates.
   * @param date 
   */
  calculateTimeBetweenDates(): any {
    let todayDate = new Date();
    let previousDate = new Date(JSON.parse(window.sessionStorage.getItem('previousDate')));
    if (todayDate && previousDate) {
      let diff = (todayDate.getTime() - previousDate.getTime()) / 1000;
      diff /= 60;
      return Math.abs(Math.round(diff));
    }
  }
  /**
   * To format date into: 'YYYY-MM-DD'
   */
   formatDate(date): any {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-');
  }

  LessonformatDate(date): any {
    let d = new Date(date),
      month = '' + (d.getMonth()  + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [month, day, year].join('-');
  }
}
