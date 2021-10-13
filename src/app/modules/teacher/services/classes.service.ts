import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClassList } from '../_model/class.model';
import { of } from 'rxjs';
import { environment } from '@environments/environment';
import { AnyARecord } from 'dns';

const API_USERS_URL = `${environment?.apiBaseUrl}`;


@Injectable({
  providedIn: 'root'
})

export class ClassesService {
  private apiServer = 'http://localhost:4200';
  private classList$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }



  getData() {
    return this.http.get('assets/JSON/class-list.JSON');

  }

  getTeacherData(id) {
    return this.http.get<any[]>(`${API_USERS_URL}/teacher/${id}`);
  }

  getGradeList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/grade`);
  }

  getStandardList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/standard`);
  }

  getClassList(id) {
    return this.http.get<any[]>(`${API_USERS_URL}/class?teacherId=${id}`);
  }

  getClassInfo(id) {
    return this.http.get<any[]>(`${API_USERS_URL}/class/${id}`);
  }

  addClass(data): Observable<any> {
    return this.http.post<any[]>(`${API_USERS_URL}/class`, data);
  }

  updateClass(id, data): Observable<any> {
    return this.http.put<any[]>(`${API_USERS_URL}/class/${id}`, data);
  }

  getClassListObs(): Observable<any> {
    return this.classList$.asObservable();
  }

  setClassListObs(classList: any) {
    this.classList$.next(classList);
  }

  getAll(): Observable<ClassList[]> {
    return this.http.get<ClassList[]>(this.apiServer).pipe(catchError(this.errorHandler));
  }

  getSettingDetails(id: number, rid?: any): Observable<any> {
    let params = new HttpParams();
    if (rid) {
      params = params.append('role_id', rid);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/settings/${id}`, { params: params });
  }

  updateSettings(data: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/settings`, data);
  }

  /**
* To get language list.
*/
  getLanguageList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/systemLanguage`);
  }

  getClassSettingByClassId(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/settings/${id}?role_id=`)
  }

  updateClassSetting(settingData: any): Observable<any> {
    return this.http.put<any[]>(`${API_USERS_URL}/settings`,settingData);
  }

  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  assignLesson(data) {
    return of("Lesson Assigned successfully");
  }
}
