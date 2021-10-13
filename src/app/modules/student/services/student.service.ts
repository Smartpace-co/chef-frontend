import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '@models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_USERS_URL = `${environment?.apiBaseUrl}`;
const API_CMS_ADMIN=`${environment?.cmsApiBaseUrl}`;
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public previousUrl$: Observable<string> = this.previousUrl.asObservable();
  private formData: BehaviorSubject<any> = new BehaviorSubject(null);
  private profileImg: BehaviorSubject<any>;
  constructor(private http: HttpClient) {
    this.profileImg = new BehaviorSubject(null);
  }

  /**
     * To set and get profile image of loggedIn student.
     */
  getProfileImage(): Observable<any> {
    return this.profileImg.asObservable();
  }
  setProfileImage(profile: any) {
    this.profileImg.next(profile);
  }

  /**
   * To get previous visited url for summary-view page.
   * @param previousUrl
   */
  setPreviousUrl(previousUrl: string) {
    this.previousUrl.next(previousUrl);
  }
  /**
   * To set and get sign-up form data.
   */
  getFormData(): Observable<any> {
    return this.formData.asObservable();
  }
  setFormData(data: any) {
    this.formData.next(data);
  }

  /**
 * To sign-up student.
 */
  studentRegister(studentData: any, token: string): Observable<any> {
    return this.http.post(`${API_USERS_URL}/student`, studentData, {
      headers: {
        token
      }
    });
  }
  /**
  * To get grade list.
  */
  getGradeList(token?: string): Observable<any> {
    if (token) {
      return this.http.get<any[]>(`${API_USERS_URL}/master/grade`, {
        headers: {
          token
        }
      });
    } else {
      return this.http.get<any[]>(`${API_USERS_URL}/master/grade`);
    }
  }
  /**
 * To get student relationship list.
 */
  getStudentRelationList(filter: any, token?: any): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('type', filter);
    }
    if (token) {
      var headers_object = new HttpHeaders().set("token", token);
      return this.http.get<any[]>(`${API_USERS_URL}/master/relation`, { params, headers: headers_object });
    } else {
      return this.http.get<any[]>(`${API_USERS_URL}/master/relation`, { params });
    }
  }
  /**
     * To get all schools.
     */
  getSchools(filter?: any, token?: any, distId?: any): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('status', filter);
    }
    if (distId) {
      params = params.append('district_id', distId);
    }
    if (token) {
      var headers_object = new HttpHeaders().set("token", token);
      return this.http.get<any[]>(`${API_USERS_URL}/school`, { params, headers: headers_object });
    } else {
      return this.http.get<any[]>(`${API_USERS_URL}/school`, { params });
    }
  }

  /**
   * To get student ethnicity list.
   */
  getStudentEthnicityList(token?: string): Observable<any> {
    if (token) {
      return this.http.get<any[]>(`${API_USERS_URL}/master/ethnicity`, {
        headers: {
          token
        }
      });
    } else {
      return this.http.get<any[]>(`${API_USERS_URL}/master/ethnicity`);
    }
  }

  /**
  * To get student medical conditions list.
  */
  getStudentMedicalConditionsList(token?: string): Observable<any> {
    if (token) {
      return this.http.get<any[]>(`${API_USERS_URL}/master/medicalcondition`, {
        headers: {
          token
        }
      });
    } else {
      return this.http.get<any[]>(`${API_USERS_URL}/master/medicalcondition`)
    }
  }
  /**
 * To get allergens list.
 */
  getAllergensList(token?: string): Observable<any> {
    if (token) {
      return this.http.get<any[]>(`${API_USERS_URL}/master/allergen`, {
        headers: {
          token
        }
      });
    } else {
      return this.http.get<any[]>(`${API_USERS_URL}/master/allergen`);
    }
  }
  /**
    *    * To check student's user name already exists/not
    * @param name
    */
  studentUserNameValidator(name: string, token?: string): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/checkUserNameConflict`, { name }, {
      headers: {
        token
      }
    });
  }
  /**
  * To get all the districts and it's details.
  */
  getAllDistrictDetails(token: string): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/districts`, {
      headers: {
        token
      }
    });
  }
  /**
     * To edit student data.
     * @param studentData
     */
  editStudentDetails(id: number, studentData: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/student/${id}`, studentData);
  }
  /**
  * To get student by id.
  */
  getStudentById(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/student/${id}`);
  }

  /**
   * To get all assigned lessons.
   */
  getAssignedLessonList(classId?: any): Observable<any> {
    let params = new HttpParams();
    if (classId) {
      params = params.append('class_id', classId);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/lesson/assigned`, { params });
  }

  /**
   * To get assigned lesson by id.
   */
  getAssignedLessonById(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson/assigned/${id}`);
  }

  /**
  * To get all explore lessons.
  */
  getExploreLessonList(countryName: string): Observable<any> {
    let params = new HttpParams();
    if (countryName) {
      params = params.append('country', countryName);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/recipe`, { params });
  }

  /**
   * Add a note in journal
   */
  addNoteInJournal(data: any): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/student/journal`, { note: data });
  }

  /**
  * To get journal.
  */
  getJournalDetails(searchText?: any, searchDate?: any): Observable<any> {
    let params = new HttpParams();
    if (searchText) {
      params = params.append('searchtext', searchText);
    }
    if (searchDate) {
      params = params.append('searchdate', searchDate);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/student/journal`, { params });
  }


  /**
   * To get assigned lesson's progress
   */
  getLessonProgress(lessonId: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/student/lesson/progress/${lessonId}`);
  }

  /**
   * To start assigned lesson's progress
   */
  startLessonProgress(data: any): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/student/lesson/progress`, data);
  }

  /**
   * To update assigned lesson's progress
   */
  updateLessonProgress(lessonId: any, data: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/student/lesson/progress/${lessonId}`, data);
  }

  /**
   * To save answer
   */
  saveAnswerToAPI(data: any): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/student/lesson/answer`, data);
  }
  getSubscriptionPackageById(id:any):Observable<any>{
    return this.http.get<any>(`${API_CMS_ADMIN}/subscriptionPackage/${id}`)
  }

  getActiveSubscribePackageDetails(id:any):Observable<any>{
    return this.http.get<any>(`${API_USERS_URL}/active/subscribePackage/${id}`)
  }

  getActiveStudentSubscribePackage(id:any,roleId:any):Observable<any>{
    return this.http.get<any>(`${API_USERS_URL}/subscribePackageStudent/active/${id}/${roleId}`)
  }

  getAllPackageList(packageType: any, token: string, id?: any, customFields?: any, rid?: any): Observable<any> {
    let url = id ? `${API_CMS_ADMIN}/subscriptionPackage/${id}` : `${API_CMS_ADMIN}/subscriptionPackage`;
    let params = new HttpParams();
    let packge, role, sts;
    if (packageType || packageType === false) {
      packge = `{ "f": "isPrivate", "v": ${packageType} }`
      sts = `{ "f": "status", "v": true }`
    }
    if (rid) {
      role = `{ "f": "packageFor", "v": ${rid} }`;
    }
    let validityFilter = `{ "f": "validityTo", "v": ${new Date().getMonth() + 1}, "o": "gte" }`;
    params = params.append('filters[root]', `[${packge},${sts},${role},${validityFilter}]`);
    if (customFields) {
      params = params.append('fields[root]', `["id","price","packageTitle"]`);
    }
    return this.http.get<any[]>(url, { params});
  }

  /**
   * To save ratings for assigned lessons.
   */
  saveRatingsToAPI(data: any): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/student/lesson/rating`, data);
  }

  /**
  * To get all class where logged in student exists.
  */
  getAllClasses(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/class`);
  }

  /**
  * To get class by id.
  */
  getClassById(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/class/${id}`);
  }

  /**
  * To self assigned lesson(explore lesson).
  */
  selfAssignLesson(rId: any): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/lesson/selfassign`, { recipeId: rId });
  }

  /**
  * To get passport details of loggedIn student.
  */
  getPassportDetails(): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/student/passport`);
  }

  /**
  * To get student-achievement details of loggedIn student.
  */
  getAchievementDetails(): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/student/achievement`);
  }

  /**
  * To get student earned stamps of loggedIn student.
  */
  getEarnedStamps(): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/student/process/stampsearned`);
  }
  /**
  * To add selected item from stamp.
  */
  addStampDetails(sId: any): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/student/item`, { itemId: sId });
  }

  getHealthAndHygieneQuestion(){
    return this.http.get<any>(`${API_CMS_ADMIN}/healthHygiene`);
  }

  getDragAndDropQuestions(){
    return this.http.get<any>(`${API_USERS_URL}/minigame/imagedragdrop`);
  }

  getFlagMatchQuestions(){
    return this.http.get<any>(`${API_USERS_URL}/minigame/flagmatch`);
  }

  getFlipImageQuestions(){
    return this.http.get<any>(`${API_USERS_URL}/minigame/imageFlip`);
  }
  /**
   * Get Health and hygine data
   */
   getHealthAndHygieneData(id): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/student/healthhygiene/`+id);
  }

  /**
   * Save Health and hygine data
   */
   saveHealthAndHygieneData(data): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/student/healthhygiene/`,data);
  }


  /**
 * To get student's lesson report.
 */
  getLessonReport(assignmentId: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/student/lesson/report/${assignmentId}`);
  }

  /**
   * To get Setting Details.
   */
  getSettingDetails(id: number, rid?: any): Observable<any> {
    let params = new HttpParams();
    if (rid) {
      params = params.append('role_id', rid);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/settings/${id}`, { params: params });
  }

  /**
   * To edit student settings.
   */
  updateSettings(data: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/settings`, data);
  }
  /**
  * To get language list.
  */
  getLanguageList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/systemLanguage`);
  }
  /**
  * To get locker item list.
  */
  getLockerItems(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/student/item`);
  }

  /**
 * To get dashboard badge notification.
 */
  getDashboardNotification(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/student/dashboardStats`);
  }
}
