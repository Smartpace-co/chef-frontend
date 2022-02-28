import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs';
import { User } from '../../../models/user';

import * as _ from 'lodash';
import { UtilityService } from '@appcore/services/utility.service';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Console } from 'console';
import { IdleTimeoutManager } from "idle-timer-manager";
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';

const API_USERS_URL = `${environment?.apiBaseUrl}`;
const CMS_API_URL = `${environment?.cmsApiBaseUrl}`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  private languageSubject: BehaviorSubject<any>;
  public currentUser: Observable<User>;
  public activateUserData: any;
  sessionToken: string;
  sessionData: any;
  timer;
  constructor(private http: HttpClient, private router: Router, private utilityService: UtilityService,
    private toast: ToasterService, private translate: TranslateService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(window.sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.languageSubject = new BehaviorSubject<User>(JSON.parse(window.sessionStorage.getItem('currentUser'))?.language?.key || 'en');
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  getLanguage(): Observable<any> {
    return this.languageSubject.asObservable();
  }
  setLanguage(lang: any) {
    this.languageSubject.next(lang);
  }
  /**
   * User Login => If user logged in with valid payload, save the currentUser into sessionStorage.
   * @param submission
   */
  login(submission: any, type?: string): any {

    let finalSubmission = _.omit(submission, 'rememberMe');
    let url = `${API_USERS_URL}/login`;
    if (type === 'student') {
      finalSubmission['userName'] = submission.email;
      finalSubmission = _.omit(finalSubmission, 'email');
      url = `${API_USERS_URL}/studentLogin`;
    }
    return this.http.post<User>(url, finalSubmission).pipe(
      map((response: any) => {
        this.timer = new IdleTimeoutManager({
          timeout: 2700, //will expire after 45 min
          onExpired: () => {
            this.logoutUser().subscribe(
              (data) => {
                this.toast.showToast('Your session has expired!', '', 'error');
              },
              (error) => {
                console.log(error);
                this.toast.showToast(error.error.message, '', 'error');
              }
            );
          }
        });
        window.sessionStorage.setItem('currentUser', JSON.stringify(response.data));
        if (response.data.language) {
          window.sessionStorage.setItem('userlanguage', response.data.language.key);
          this.languageSubject.next(response.data.language.key)
          this.setuserlang();
        }
        else{
          window.sessionStorage.setItem('userlanguage', 'en');
          this.setuserlang();
        }
        this.currentUserSubject.next(response.data);
        return response.data;
      })
    );

  }
  /**
   * Remove user from local & session storage and set current user to null
   */
  logoutUser(): any {
    return this.http.post(`${API_USERS_URL}/logout`, {}).pipe(
      map((response: any) => {
        window.sessionStorage.clear();
        window.localStorage.clear();
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
        return response;
      })
    );
  }

  register(user: User) {
    //  return this.http.post(`${config.apiUrl}/users/register`, user);
    return of('Registration Successful');
  }

  public isUserSignedIn(): boolean {
    if (window.sessionStorage.getItem('currentUser')) {
      return !_.isEmpty(JSON.parse(window.sessionStorage.getItem('currentUser')).token);
    }
  }

  public getCurrentUserRole() {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem("currentUser"))
    let title = "";
    if (this.activateUserData.parent_role && this.activateUserData.role) {
      title = this.activateUserData.parent_role.title.toLowerCase();
    }
    else {
      title = this.activateUserData.role.title.toLowerCase();
    }
    return title;
  }

  /**
   * Register district admin
   * @param data
   */
  public registerDistrictAdmin(data: any, token: any): Observable<any> {
    const url = `${API_USERS_URL}/districtAdmin/registration`;
    if (token) {
      return this.http.post(url, data, {
        headers: {
          token
        }
      });
    } else {
      return this.http.post(url, data);
    }
  }
  /**
   * To get encrypted query params in json.
   */
  queryParamsToJSON(encryptParam: string) {
    if (encryptParam) {
      let decoedString = atob(encryptParam);
      let pairs = decoedString.slice(0).split('&');
      var result = {};
      pairs.forEach(function (pair: any) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
      });
      return JSON.parse(JSON.stringify(result));
    }
  }
  /**  
   * To get all package list.
   *  
   */
  getAllPackageList(packageType: any, token: string, id?: any, customFields?: any, rid?: any): Observable<any> {

    let url = id ? `${CMS_API_URL}/subscriptionPackage/${id}` : `${CMS_API_URL}/subscriptionPackage`;
    var headers_object = new HttpHeaders().set('token', token);
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
      params = params.append('fields[root]', `["id","price","priceId","packageTitle","description","maxUser","validityFrom","validityTo"]`);
    }
    return this.http.get<any[]>(url, { params, headers: headers_object });
  }

  /**
   * To get guest user token
   */
  getGuestUserToken(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/guestToken`);
  }
  /**
   * Forgot pwd => If email exists send link to the user.
   * @param email
   */
  forgotPassword(email: string, type?: string): Observable<any> {
    if (type === 'student') {
      return this.http.post<boolean>(`${API_USERS_URL}/studentForgotPassword/validateEmail`, { userName: email['email'] });
    } else {
      return this.http.post<boolean>(`${API_USERS_URL}/forgotPassword/validateEmail`, email);
    }
  }

  /**
   * Reset pwd => If email exists change password by the user and return true
   * @param password
   * @param token
   */
  resetPassword(password: string, token): Observable<boolean> {
    return this.http.put<boolean>(`${API_USERS_URL}/resetPassword/${token}`, { password });
  }

  /**
   * To change password.
   */
  changePassword(data: any): Observable<any> {
    let submission = {};
    submission['currentPassword'] = data.current_password;
    submission['newPassword'] = data.new_password;
    return this.http.put<boolean>(`${API_USERS_URL}/changepassword`, submission);
  }

  /**
   * To get master roles.
   */
  getAllMasterRoleDetails(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/masterrole`);
  }

  /**
   * To get all the roles and it's details.
   */
  getAllRoleDetails(status?: any): Observable<any> {
    let params = new HttpParams();
    if (status) {
      params = params.append('status', status);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/role`, { params });
  }

  /**
    * Register School admin
    * @param data
    */
  public registerSchoolAdmin(data: any, token: any): Observable<any> {
    if (token) {
      var headers_object = new HttpHeaders().set('token', token);
    }
    return this.http.post(`${API_USERS_URL}/school`, data, { headers: headers_object })
  }


  /**
   * To get all the districts and it's details.
   */
  getAllDistrictDetails(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/districts`);
  }


  /**
   * To get all the schools and it's details for selected district.
   */
  getAllDistrictSchoolDetails(filter?: any, token?: any, distId?: any): Observable<any> {
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
  * Register Teacher admin
  * @param data 
  */
  public registerTeacher(data: any, token: any): Observable<any> {
    if (token) {
      var headers_object = new HttpHeaders().set('token', token);
    }
    const url = `${API_USERS_URL}/teacher`;
    return this.http.post(url, data, { headers: headers_object });
  }

  /**
   *Function to set the user language 
   */
  setuserlang() {
   this.translate.use(sessionStorage.getItem('userlanguage') || 'en');
  }

  /**
   * Create stripe payment session
   */

  createStripePaymentSession(data, token): Observable<any> {
    if (token) {
      var headers_object = new HttpHeaders().set('token', token);
      return this.http.post(`${API_USERS_URL}/payment/session`, data, { headers: headers_object })
    } else {
      return this.http.post(`${API_USERS_URL}/payment/session`, data)
    }
  }

  /**
   * function to save stripe transactions to backend
   */

  saveTransaction(data, token) {
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    if (token && !this.sessionData) {
      var headers_object = new HttpHeaders().set('token', token);
      return this.http.post(`${API_USERS_URL}/payment/charge`, data, { headers: headers_object })
    } else {
      return this.http.post(`${API_USERS_URL}/payment/charge`, data)
    }
  }
}
