import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';
import { environment } from '@environments/environment';

const API_USERS_URL = `${environment?.apiBaseUrl}`;
const API_CMS_ADMIN=`${environment?.cmsApiBaseUrl}`;

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private profileObs: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient) {
  }

  /**
   * To set and get profile details of loggedIn user.
   */
  getProfileObs(): Observable<any> {
    return this.profileObs.asObservable();
  }
  setProfileObs(profile: any) {
    this.profileObs.next(profile);
  }

  /**
   * To check email already exists/not
   * @param email 
   */
  emailValidator(email: string): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/helper/checkEmailConflict`, { email });
  }

  /**
   *    * To check contact number already exists/not
   * @param cNumber 
   */
  contactValidator(cNumber: string): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/helper/checkPhoneNumberConflict`, { phone_number: cNumber });
  }

  /**
   * To add Roles
   * @param roleData 
   */
  addRole(roleData: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/role`, roleData);
  }

  /**
   * To edit role details.
   */
  editRole(id: number, roleData: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/role/${id}`, roleData);
  }

  /**
   * To get role details by id
   */
  getRoleById(rid: number): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/role/${rid}`);
  }

  /**
   *    * To check role name already exists/not
   * @param name 
   */
  roleNameValidator(name: string): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/checkRoleNameConflict`, { name });
  }

  /**
   * To get district profile and agent profile.
   */
  getDistrictProfile(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/districtAdmin/profile`);
  }

  /**
   * To add school details.
   */
  addSchoolDetails(schoolData: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/school`, schoolData);
  }

  /**
   * To edit school data.
   * @param schoolData 
   */
  editSchoolDetails(id: any, schoolData: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/school/${id}`, schoolData);
  }

  /**
  * To validate school with name is already exists/not.
  */
  schoolNameValidator(name: string): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/checkSchoolNameConflict`, { name });
  }

  /**
   * To get all schools.
   */
  getSchools(filter?: any): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('status', filter);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/school`, { params: params });
  }
  /**
   * To get all schools.
   */
   getAllSchools(duration:any,filter?: any): Observable<any> {
    let params = new HttpParams();

    if (filter) {
      params = params.append('status', filter);
      params = params.append('duration', duration);

    }
    return this.http.get<any[]>(`${API_USERS_URL}/school`, { params: params });
  }

  /**
   * To get school by id.
   * @param id
   */
  getSchoolById(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/school/${id}`);
  }

  /**
   * Upload profile image.
   */
  uploadProfileImg(image: File[]): Observable<any> {
    let fileData = new FormData;
    Array.from(image).forEach(f => fileData.append('file', f));
    return this.http.post(`${API_CMS_ADMIN}/imageUpload`, fileData);
  }
  /**
  * To update district/agent Profile details.
  */
  updateDistrictProfile(submission: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/districtAdmin/profile/`, submission);
  }

  /**
  * To add user details.
  */
  addUserDetails(userData: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/districtUser`, userData);
  }

  /**
   * To edit user data.
   * @param userData 
   */
  editUserDetails(id: any, userData: any): Observable<any> {

    return this.http.put(`${API_USERS_URL}/districtUser/${id}`, userData);
  }
  /**
   * To get USer by id.
   */
  getUserById(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/districtUser/${id}`);
  }

  /**
  * To get all user.
  */
  getAllUser(filter?: any,sortBy?: string): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('status', filter);
    }
    if (sortBy) {
      params = params.append('sort_by', 'user_id');
      params = params.append('sort_order', sortBy);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/districtUser`, { params: params });
  }

  /**
   * To insert user data in bulk.
   * @param data 
   */
  insertUserBulkData(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/districtUser/file`, data, {
      reportProgress: true,
      observe: 'events'
    });
  }
  /**
   * Upload file and get mediaFileName to start bulk upload.
   * @param formData 
   */
  fileUpload(formData: any) {
    return this.http.post(`${API_USERS_URL}/fileupload`, formData)
  }

  /**
   * To download sample .xlsx, .xls, .csv file
   * @param type 
   */
  downloadFile(type: string) {
    return this.http.get(`${API_USERS_URL}/demofile/${type}`, { responseType: "blob" })
  }

  /**
 * To add teacher details.
 */
  addTeacherDetails(teacherData: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/teacher`, teacherData);
  }
  /**
   * To edit teacher data.
   * @param teacherData 
   */
  editTeacherDetails(id: any, teacherData: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/teacher/${id}`, teacherData);
  }
  /**
  * To get teacher by id.
  */
  getTeacherById(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/teacher/${id}`);
  }
  /**
  * To get all teacher.
  */
  getAllTeacher(filter?: any, schoolId?: any, sortBy?: string, existInSchool?: boolean): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('status', filter);
    }
    if (schoolId) {
      params = params.append('school_id', schoolId);
    }
    if (existInSchool || existInSchool === false) {
      params = params.append('existInSchool', existInSchool.toString());
    }
    if (sortBy) {
      // params = params.append('sort_by', 'teacher_id');
      params = params.append('sort_order', sortBy);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/teacher`, { params: params });
  }


  /**
   * To insert teacher data in bulk.
   * @param data 
   */
  insertTeacherBulkData(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/teacher/file`, data, {
      reportProgress: true,
      observe: 'events'
    });
  }
  /**
  * To get grade list.
  */
  getGradeList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/grade`);
  }

  /**
  * To get language list.
  */
   getLanguageList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/systemLanguage`);
  }

  /**
  * To get subject list.
  */
  getSubjectList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/subject`);
  }
  /**
  * To get learning standards.
  */
  getLearningStandardList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/standard`);
  }
 /**
  * To get ELA standard 
  */
  getELAStandards(): Observable<any> {
    return this.http.get<any[]>(API_CMS_ADMIN+'/standard?filters[subjects]=[{"f":"title","v":"ELA"}]&sorting[root]=[{"f":"standardTitle","o":"ASC"}]');
  }
  /**
  * To get maths' standard  
  */
   getMathStandards(): Observable<any> {
    return this.http.get<any[]>(API_CMS_ADMIN+'/standard?filters[subjects]=[{"f":"title","v":"MATH"}]&sorting[root]=[{"f":"standardTitle","o":"ASC"}]');
  }/**
  * To get NGSS standard
  */
  getNGSSStandards(): Observable<any> {
    return this.http.get<any[]>(API_CMS_ADMIN+'/standard?filters[subjects]=[{"f":"title","v":"NGSS"}]&sorting[root]=[{"f":"standardTitle","o":"ASC"}]');
  }/**
  * To get NCSS standard
  */
  getNCSSStandards(): Observable<any> {
    return this.http.get<any[]>(API_CMS_ADMIN+'/standard?filters[subjects]=[{"f":"title","v":"NCSS"}]&sorting[root]=[{"f":"standardTitle","o":"ASC"}]');
  }
  /**
    * To validate class with name is already exists/not.
    */
  classNameValidator(name: string): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/checkClassNameConflict`, { name });
  }
  /**
 * To add class details.
 */
  addClassDetails(classData: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/class`, classData);
  }
  /**
   * To edit class data.
   * @param classData 
   */
  editClassDetails(id: any, classData: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/class/${id}`, classData);
  }
  /**
  * To get class by id.
  */
  getClassById(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/class/${id}`);
  }
  /**
  * To get all class.
  */
  getAllClasses(filter: any, sortBy?: string, schoolId?: any, existInSchool?: any): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('status', filter);
    }
    if (schoolId) {
      params = params.append('school_id', schoolId);
    }
    if (sortBy) {
      params = params.append('sort_by', 'grade');
      params = params.append('sort_order', sortBy);
    }
    if (existInSchool || existInSchool === false) {
      params = params.append('existInSchool', existInSchool.toString());
    }
    return this.http.get<any[]>(`${API_USERS_URL}/class`, { params: params });
  }
  /**
   * To delete class.
   */
  deleteClass(id: any): Observable<any> {
    return this.http.delete<any[]>(`${API_USERS_URL}/class/delete/${id}`);
  }

  /**
   * To archive class.
   */
  archiveClass(id: any): Observable<any> {
    return this.http.put<any[]>(`${API_USERS_URL}/class/archive/${id}`, {});
  }
  getClassSettingByClassId(id:any):Observable<any>{
    return this.http.get<any[]>(`${API_USERS_URL}/getSettings/${id}`)
  }

  /**
  * To get student relationship list.
  */
  getStudentRelationList(): Observable<any> {
    // let params = new HttpParams();
    // if (filter) {
    //   params = params.append('type', filter);
    // }
    return this.http.get<any[]>(`${API_USERS_URL}/master/relation`);
  }
  /**
    * To get student ethnicity list.
    */
  getStudentEthnicityList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/ethnicity`);
  }

  /**
  * To get student medical conditions list.
  */
  getStudentMedicalConditionsList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/medicalcondition`);
  }
  /**
    *    * To check student's user name already exists/not
    * @param name 
    */
  studentUserNameValidator(name: string): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/checkUserNameConflict`, { name });
  }

  /**
 * To add student details.
 */
  addStudentDetails(studentData: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/student`, studentData);
  }
  /**
    * To edit student data.
    * @param studentData 
    */
  editStudentDetails(id: any, studentData: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/student/${id}`, studentData);
  }
  /**
  * To get student by id.
  */
  getStudentById(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/student/${id}`);
  }

  /**
  * To get students by class id.
  */
  getStudentsByClassId(id: any, filter?: any, sortBy?: any): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('status', filter);
    }
    if (sortBy) {
      params = params.append('sort_by', 'student_id');
      params = params.append('sort_order', sortBy);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/student/class/${id}`, { params: params });
  }
  /**
  * To get all student.
  */
  getAllStudents(filter: any, sortByGrade?: any, sortById?: string, schoolId?: any,existInSchool?:any): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('status', filter);
    }
    if (schoolId) {
      params = params.append('school_id', schoolId);
    }
    // params=params.append('duration',"week")
    if (sortById) {
      params = params.append('sort_by', 'student_id');
      params = params.append('sort_order', sortById);
    }
    if (sortByGrade) {
      params = params.append('sort_by', 'grade');
      params = params.append('sort_order', sortByGrade);
    }
    if (existInSchool || existInSchool === false) {
      params = params.append('existInSchool', existInSchool.toString());
    }
    return this.http.get<any[]>(`${API_USERS_URL}/student`, { params: params });
  }

  /**
   * To insert student data in bulk.
   * @param data 
   */
  insertStudentBulkData(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/student/file`, data, {
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * To get FAQs list with search.
   */
  getFaqList(searchTxt?: string): Observable<any> {
    let params = new HttpParams();
    if (searchTxt) {
      params = params.append('search', searchTxt);
    }
    params = params.append('page_size', '20');
    params = params.append('page_no', '1');
    params = params.append('status', '1');
    return this.http.get<any[]>(`${API_USERS_URL}/master/faqs`, { params: params });
  }
  /**
   * To get contact us details.
   */
  getContactUsDetails(): Observable<any> {
    let params = new HttpParams();
    params = params.append('status', '1');
    return this.http.get<any[]>(`${API_USERS_URL}/master/contactus`, { params: params });
  }

  /**
    * To edit settings for class/school/content-store/district-admin.
    * @param data 
  */
  editSettings(data: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/settings`, data);
  }
  /**
   * To get settings for class/school/content-store/district-admin.
  */
  getSettings(id: number, rid?: any): Observable<any> {
    let params = new HttpParams();
    if (rid) {
      params = params.append('role_id', rid);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/settings/${id}`, { params: params });
  }

  getAllAccessModules():Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/accessmodule`)
  }

  getBillingDetails(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/payment/${id}`)

  }

  getActiveSubscribePackageDetails(id:any):Observable<any>{
    return this.http.get<any>(`${API_USERS_URL}/active/subscribePackage/${id}`)
  }
  /**  
   * To get all package list.
   *  
   */
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
    params= params.append('fields[subscription_package_plans]',`["id","priceId"]`);

    return this.http.get<any[]>(url, { params});
  }

   
 createSubscriptionPackage(data: any): Observable<any> {
  return this.http.post(`${API_USERS_URL}/subscribePackage`, data);
}

createStripePaymentSession(data, token): Observable<any> {
  return this.http.post(`${API_USERS_URL}/payment/session`, data)
}


getSubscriptionPackageById(id:any):Observable<any>{
  return this.http.get<any>(`${API_CMS_ADMIN}/subscriptionPackage/${id}`)
}


getSubscribePackageDetails(id:any):Observable<any>{
  return this.http.get<any>(`${API_USERS_URL}/subscribePackage/${id}`)
}

getDistrictUserProfile():Observable<any>{
  return this.http.get<any>(`${API_USERS_URL}/districtuser/profile`)
}
getDistrictAdminProfile(id:any):Observable<any>{
  return this.http.get<any>(`${API_USERS_URL}/district/profile/${id}`)
}
updateDistrictUserProfile(submission:any):Observable<any>{
  return this.http.put<any>(`${API_USERS_URL}/districtUser/profile`,submission)
}
getAllAllergens():Observable<any>{
  return this.http.get(`${API_USERS_URL}/master/allergen`)
}
getAccessModulesByRoleId(id:any):Observable<any> {
  return this.http.get<any[]>(`${API_USERS_URL}/accessmodule/${id}`)
}

getClassCount(id:any,roleId:any,packageId:any):Observable<any> {
  return this.http.get<any[]>(`${API_USERS_URL}/count/class?id=${id}&roleId=${roleId}&packageId=${packageId}`)

}

verifyMaxUserCountClass(id:any,roleId:any):Observable<any> {
  return this.http.get<any[]>(`${API_USERS_URL}/verifyMaxUser?id=${id}&roleId=${roleId}`)

}

/**
  * To add report details.
  */
 addReport(data: any): Observable<any> {
  return this.http.post(`${API_USERS_URL}/reportIssue`, data);
}

getReportHistoryById(reportHistoryId:any)
{
  return this.http.get<any[]>(`${API_USERS_URL}/reportIssue/report/${reportHistoryId}`)
}

getReportReplies(id:any):Observable<any>{
  return this.http.get<any[]>(`${API_USERS_URL}/issueFeedback/${id}`)
}

/**
  * To add discussion forums details
  */
 addDiscussionForumDetails(data: any): Observable<any> {
  return this.http.post(`${API_USERS_URL}/discussionForum`, data);
}

deleteReply(id: string): Observable<any> {
  return this.http.delete<any[]>(`${API_USERS_URL}/reply/${id}`);
}

addReply(data: any): Observable<any> {
  return this.http.post(`${API_USERS_URL}/reply`, data);
}
/**
  * To get discussion forums details
  */
 getDiscussionForumInfoById(id: string): Observable<any> {
  return this.http.get<any[]>(`${API_USERS_URL}/discussionForum/${id}`);
}
/**
  * To get all discussion forum comments.
  */
 getComments(id: string): Observable<any> {
  return this.http.get<any[]>(`${API_USERS_URL}/comments/${id}`);
}
getAllReportHistories(id: string): Observable<any> {
  return this.http.get<any[]>(`${API_USERS_URL}/reportIssue/${id}`);
}

updateVote(data:any):Observable<any>{
  return this.http.post(`${API_USERS_URL}/vote`,data)

}

deleteComment(id: string): Observable<any> {
  return this.http.delete<any[]>(`${API_USERS_URL}/comments/${id}`);
}
/**
  * To get all replies by comment Id.
  */
 getReplies(id: string): Observable<any> {
  return this.http.get<any[]>(`${API_USERS_URL}/reply/${id}`);
}

getVote(discussionForumId:any): Observable<any> {
  return this.http.get(`${API_USERS_URL}/vote/${discussionForumId}`)
}

addVote(id: any,data:any): Observable<any> {
  return this.http.put(`${API_USERS_URL}/vote/${id}`, data);
}
addComment(data: any): Observable<any> {
  return this.http.post(`${API_USERS_URL}/comments`, data);
}
  /**
  * To get all discussion forums.
  */
   getAllDiscussionForumTopics(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/discussionForum`);
  }

  getAllAssignedLessons(duration, district_id) {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson/assigned?duration=${duration}&district_id=${district_id}`);
  }

  getAllInactiveUser(status: any, duration: string): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/districtUser?status=${status}&duration=${duration}`);
  }

  getAllTopRatedLesson(duration: string): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson/topRated?duration=${duration}`);
  }

  getNumberOfTimesLessonAssigned(recipeId): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/receipe/assigned/${recipeId}`);
  }

  getClassActivityReport(filter: any, duration: any): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('district_id', filter);
      params = params.append('duration', duration);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/class`, { params: params });
  }

  getStudentReport(filter: any, duration: any): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('school_id', filter);
      params = params.append('duration', duration);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/class`, { params: params });
  }

  getClassReport(filter: any, duration: any): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('school_id', filter);
      params = params.append('duration', duration);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/class`, { params: params });
  }

  getAllDeletedClasses(schoolId: any, duration: any): Observable<any> {
    let params = new HttpParams();
      params = params.append('school_id', schoolId);
      params = params.append('duration', duration);
    return this.http.get<any[]>(`${API_USERS_URL}/deleted/class`, { params: params });
  }

  getStandardProficiencyPercentage(duration:any,id: any): Observable<any> {
    if(duration)
    {
      return this.http.get<any[]>(`${API_USERS_URL}/class/report/${id}?duration=${duration}`);

    }
    return this.http.get<any[]>(`${API_USERS_URL}/class/report/${id}`);
  }

  getPracticeAndGrowthReport(districtId): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/districtDashboard/practiceAndGrowth/${districtId}`);
  }


  getTopActiveSessionStudents(duration:any,entityId:any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/topActiveSessionStudents?entityId=${entityId}&duration=${duration}`);
  }

  getInactiveStudents(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/student?status=0`);
  }

  studentWithAboveAndBelowAverageActivity(duration):Observable<any>{
    return this.http.get<any[]>(`${API_USERS_URL}/studentAboveBelowAverage?duration=${duration}`);

  }
  getNewTeacher(status: any, duration: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('status', status);
    params=params.append('duration', duration);
    return this.http.get<any[]>(`${API_USERS_URL}/teacher`, { params: params });
  }

  
  getTopActiveSessionTeachers(duration:any,entityId:any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/topActiveSessionTeachers?entityId=${entityId}&duration=${duration}`);
  }

  getNewStudents(status: any,duration:any): Observable<any> {
    let params = new HttpParams();
      params = params.append('status', status);
      params=params.append('duration', duration);
    return this.http.get<any[]>(`${API_USERS_URL}/student`, { params: params });
  }

 /**
   * To get all package list.
   *
   */
  getPackageListForEdit(packageType: any, token: string, id?: any, customFields?: any, rid?: any): Observable<any> {
    let url = id ? `${API_CMS_ADMIN}/subscriptionPackage/${id}` : `${API_CMS_ADMIN}/subscriptionPackage`;
    let params = new HttpParams();
    let packge, role, sts;
    if (packageType || packageType === false) {
      packge = `{ "f": "isPrivate", "v": ${packageType} }`;
      sts = `{ "f": "status", "v": true }`;
    }
    if (rid) {
      role = `{ "f": "packageFor", "v": ${rid} }`;
    }
    let validityFilter = `{ "f": "validityTo", "v": ${new Date().getMonth() + 1}, "o": "gte" }`;
    params = params.append('filters[root]', `[${packge},${sts},${role},${validityFilter}]`);
    if (customFields) {
      params = params.append('fields[root]', `["id","price","packageTitle","priceId","validityFrom","validityTo"]`);
    }
  //  params= params.append('fields[subscription_package_plans]',`["id","priceId"]`);
    return this.http.get<any[]>(url, { params });
  }
  
showContactInformationToStudent(): Observable<any> {
  return this.http.get<any[]>(`${API_USERS_URL}/showContactInformationToStudent`);
}

}
