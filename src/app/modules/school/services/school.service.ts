import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';
import { environment } from '@environments/environment';

const API_USERS_URL = `${environment?.apiBaseUrl}`;
const API_CMS_ADMIN = `${environment?.cmsApiBaseUrl}`;
@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private profileObs: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient) {}

  /**
   * To add Roles
   * @param roleData
   */
  addRole(roleData: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/role`, roleData);
  }

  /**
   * To get role details by id
   */
  getRoleById(rid: number): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/role/${rid}`);
  }

  /**
   * To edit role details.
   */
  editRole(id: number, roleData: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/role/${id}`, roleData);
  }

  /**
   * To get all user.
   */
  getAllUser(filter?: any, sortBy?: string): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('status', filter);
    }
    if (sortBy) {
      params = params.append('sort_by', 'user_id');
      params = params.append('sort_order', sortBy);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/schoolUser`, { params: params });
  }

  getAllInactiveUser(status: any, duration: string): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/schoolUser?status=${status}&duration=${duration}`);
  }

  getAllTopRatedLesson(duration: string): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson/topRated?duration=${duration}`);
  }

  /**
   * To get USer by id.
   */
  getUserById(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/schoolUser/${id}`);
  }
  /**
   * To get school details by user id
   */
  getSchoolDetailsByUserId(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/schoolDetails/${id}`);
  }
  /**
   *    * To check contact number already exists/not
   * @param cNumber
   */
  contactValidator(cNumber: string): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/helper/checkPhoneNumberConflict`, { phone_number: cNumber });
  }

  /**
   * To edit user data.
   * @param userData
   */
  editUserDetails(id: any, userData: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/schoolUser/${id}`, userData);
  }

  /**
   * To add user details.
   */
  addUserDetails(userData: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/schoolUser`, userData);
  }
  /**
   * To insert user data in bulk.
   * @param data
   */
  insertUserBulkData(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/schoolUser/file`, data, {
      reportProgress: true,
      observe: 'events'
    });
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
   * To get school profile and agent profile.
   */
  getSchoolProfile(id): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/school/${id}`);
  }

  /**
   * To update school/agent Profile details.
   */
  updateSchoolProfile(submission: any, id: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/school/${id}`, submission);
  }

  /**
   * Upload profile image.
   */
  uploadProfileImg(image: File[]): Observable<any> {
    let fileData = new FormData();
    Array.from(image).forEach((f) => fileData.append('file', f));
    return this.http.post(`${API_CMS_ADMIN}/imageUpload`, fileData);
  }

  /**
   * Upload file and get mediaFileName to start bulk upload.
   * @param formData
   */
  fileUpload(formData: any) {
    return this.http.post(`${API_USERS_URL}/fileupload`, formData);
  }
  /**
   * To insert user data in bulk.
   * @param data
   */
  inserBulkData(data: any): Observable<any> {
    return this.http.post(
      `${API_USERS_URL}/schoolUser/file`,
      { file_name: data },
      {
        reportProgress: true,
        observe: 'events'
      }
    );
  }

  /**
   * To get all teacher.
   */
  getAllTeacher(filter: any, schoolId?: any, sortBy?: string): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('status', filter);
    }
    if (schoolId) {
      params = params.append('school_id', schoolId);
    }
    if (sortBy) {
      params = params.append('sort_by', 'teacher_id');
      params = params.append('sort_order', sortBy);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/teacher`, { params: params });
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
   * To get teacher by id.
   */
  getTeacherById(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/teacher/${id}`);
  }
  /**
   * To get all teacher.
   */

  /**
   * To edit teacher data.
   * @param teacherData
   */
  editTeacherDetails(id: any, teacherData: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/teacher/${id}`, teacherData);
  }

  /**
   * To add teacher details.
   */
  addTeacherDetails(teacherData: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/teacher`, teacherData);
  }

  /**
   * To get all class.
   */
  getAllClasses(filter: any, schoolId?: any, sortBy?: string): Observable<any> {
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
    return this.http.get<any[]>(`${API_USERS_URL}/class`, { params: params });
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
   * To get grade list.
   */
  getGradeList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/grade`);
  }

  /**
   * To get learning standards.
   */
  getLearningStandardList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/standard`);
  }

  /**
   * To get class by id.
   */
  getClassById(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/class/${id}`);
  }

  /**
   * To edit class data.
   * @param classData
   */
  editClassDetails(id: any, classData: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/class/${id}`, classData);
  }

  /**
   * To delete class.
   */
  deleteClass(id: any): Observable<any> {
    return this.http.delete<any[]>(`${API_USERS_URL}/Class/delete/${id}`);
  }

  /**
   * To archive class.
   */
  archiveClass(id: any): Observable<any> {
    return this.http.put<any[]>(`${API_USERS_URL}/class/archive/${id}`, {});
  }

  getClassByGradeId(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/class?grade_id=${id}`);
  }
  getClassSettingByClassId(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/settings/${id}?role_id=`);
  }
  /**To add student*/
  addStudent(studentData: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/student`, studentData);
  }

  getStudents(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/student`);
  }
  /**
   * To get student by id.
   */
  getStudentById(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/student/${id}`);
  }

  /**
   * To get student by id and class id.
   */
  addStudentInfoByClassId(classId: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/class/${classId}`);
  }
  /**
   * To get students by class id.
   */
  getStudentsByClassId(id: any, filter: any, sortBy?: string): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('status', filter);
    }
    if (sortBy) {
      params = params.append('sort_by', 'student_id');
      params = params.append('sort_order', sortBy);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/student/class/${id},`, { params: params });
  }

  /**
   *    * To check student's user name already exists/not
   * @param name
   */
  studentUserNameValidator(name: string): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/checkUserNameConflict`, { name });
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
   * To get all student.
   */
  getAllStudents(filter: any, sortBy?: string): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('status', filter);
    }
    if (sortBy) {
      params = params.append('sort_by', 'grade');
      params = params.append('sort_order', sortBy);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/student`, { params: params });
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
   * To edit student data.
   * @param studentData
   */
  editStudentDetails(id: any, studentData: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/student/${id}`, studentData);
  }

  /**
   * To add student details.
   */
  addStudentDetails(studentData: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/student`, studentData);
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
   * To get student profile
   */
  getStudentProfile(id: string): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/student/${id}`);
  }

  updateClassSetting(settingData: any): Observable<any> {
    return this.http.put<any[]>(`${API_USERS_URL}/settings`, settingData);
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
   * To insert teacher data in bulk.
   * @param data
   */
  insertTeacherBulkData(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/teacher/file`, data, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getSubjectList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/subject`);
  }

  getSettings(id: number, rid?: any): Observable<any> {
    let params = new HttpParams();
    if (rid) {
      params = params.append('role_id', rid);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/settings/${id}`, { params: params });
  }

  editSettings(data: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/settings`, data);
  }
  /**
   * To add report details.
   */
  addReport(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/reportIssue`, data);
  }

  /**
   * To get all discussion forums.
   */
  getAllDiscussionForumTopics(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/discussionForum`);
  }
  /**
   * To add discussion forums details
   */
  addDiscussionForumDetails(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/discussionForum`, data);
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

  addComment(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/comments`, data);
  }

  addReply(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/reply`, data);
  }
  deleteComment(id: string): Observable<any> {
    return this.http.delete<any[]>(`${API_USERS_URL}/comments/${id}`);
  }

  deleteReply(id: string): Observable<any> {
    return this.http.delete<any[]>(`${API_USERS_URL}/reply/${id}`);
  }
  /**
   * To get all replies by comment Id.
   */
  getReplies(id: string): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/reply/${id}`);
  }

  getAllReportHistories(id: string): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/reportIssue/${id}`);
  }

  addVote(id: any, data: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/vote/${id}`, data);
  }

  //To get all access modules

  getAllAccessModules(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/accessmodule`);
  }

  getSubscriptionPackageById(id: any): Observable<any> {
    return this.http.get<any>(`${API_CMS_ADMIN}/subscriptionPackage/${id}`);
  }

  getSubscribePackageDetails(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/subscribePackage/${id}`);
  }
  getActiveSubscribePackageDetails(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/active/subscribePackage/${id}`);
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
      packge = `{ "f": "isPrivate", "v": ${packageType} }`;
      sts = `{ "f": "status", "v": true }`;
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
    return this.http.get<any[]>(url, { params });
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
  

  getBillingDetails(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/payment/${id}`);
  }

  createSubscriptionPackage(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/subscribePackage`, data);
  }

  createStripePaymentSession(data, token): Observable<any> {
    return this.http.post(`${API_USERS_URL}/payment/session`, data);
  }

  getVote(discussionForumId: any): Observable<any> {
    return this.http.get(`${API_USERS_URL}/vote/${discussionForumId}`);
  }

  updateVote(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/vote`, data);
  }

  getAllAllergens(): Observable<any> {
    return this.http.get(`${API_USERS_URL}/master/allergen`);
  }

  getSchoolUserProfile(): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/schoolUser/profile`);
  }

  updateSchoolUserProfile(userData: any): Observable<any> {
    return this.http.put<any>(`${API_USERS_URL}/schoolUser/profile`, userData);
  }

  getAccessModulesByRoleId(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/accessmodule/${id}`);
  }

  getClassCount(id: any, roleId: any, packageId: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/count/class?id=${id}&roleId=${roleId}&packageId=${packageId}`);
  }
  verifyMaxUserCountClass(id: any, roleId: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/verifyMaxUser?id=${id}&roleId=${roleId}`);
  }

  getUserDetailsByID(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/district/profile/${id}`);
  }

  getReportReplies(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/issueFeedback/${id}`);
  }
  getReportHistoryById(reportHistoryId: any) {
    return this.http.get<any[]>(`${API_USERS_URL}/reportIssue/report/${reportHistoryId}`);
  }
  getAllAssignedLessons(duration, school_id) {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson/assigned?duration=${duration}&school_id=${school_id}`);
  }
  getNumberOfTimesLessonAssigned(recipeId): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/receipe/assigned/${recipeId}`);
  }
  /**
   * To get contact us details.
   */
  getContactUsDetails(): Observable<any> {
    let params = new HttpParams();
    params = params.append('status', '1');
    return this.http.get<any[]>(`${API_USERS_URL}/master/contactus`, { params: params });
  }

  getClassActivityReport(filter: any, duration: any): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      params = params.append('school_id', filter);
      params = params.append('duration', duration);
    }
    return this.http.get<any[]>(`${API_USERS_URL}/class`, { params: params });
  }

  getStandardProficiencyPercentage(duration:any,id: any): Observable<any> {
    if(duration)
    {
      return this.http.get<any[]>(`${API_USERS_URL}/class/report/${id}?duration=${duration}`);

    }
    return this.http.get<any[]>(`${API_USERS_URL}/class/report/${id}`);
  }
  
  getPracticeAndGrowthReport(schoolId): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/schoolDashboard/practiceAndGrowth/${schoolId}`);
  }

  getTopActiveSessionTeachers(duration:any,entityId:any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/topActiveSessionTeachers?entityId=${entityId}&duration=${duration}`);
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
  
  /**
  * To get language list.
  */
   getLanguageList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/master/systemLanguage`);
  }
  getNewStudents(status: any,duration:any): Observable<any> {
    let params = new HttpParams();
      params = params.append('status', status);
      params=params.append('duration', duration);
    return this.http.get<any[]>(`${API_USERS_URL}/student`, { params: params });
  }

  getNewTeacher(status: any, duration: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('status', status);
    params=params.append('duration', duration);
    return this.http.get<any[]>(`${API_USERS_URL}/teacher`, { params: params });
  }

showContactInformationToStudent(): Observable<any> {
  return this.http.get<any[]>(`${API_USERS_URL}/showContactInformationToStudent`);
}
}
