import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const API_USERS_URL = `${environment?.apiBaseUrl}`;
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  /**
  * To get notification count.
  */
  getNotificationCount(id: number, rid: number): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/notificationCount/${id}/${rid}`);
  }
  /**
   * To get notification details.
   */
  getNotificationDetails(id: number, rid: number): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/notification/${id}/${rid}`);
  }

  /**
   * To update notification.
   */
  updateNotification(id: number, rid: number, data: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/notification/seen/${id}/${rid}`, data);
  }
}
