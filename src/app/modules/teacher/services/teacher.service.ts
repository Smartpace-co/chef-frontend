import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '@environments/environment';

const API_USERS_URL = `${environment?.apiBaseUrl}`;
const API_CMS_ADMIN = `${environment?.cmsApiBaseUrl}`;

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private profileObs: BehaviorSubject<any> = new BehaviorSubject(null);
  private subject = new Subject<any>();
  private reportTypeSubject = new Subject<any>();
  navchange: EventEmitter<number> = new EventEmitter();
  private allLessonSubject = new Subject<any>();
  private lessonSubject = new Subject<any>();
  private topRatedLessonSubject = new Subject<any>();
  private suggestedForYouLessonSubject = new Subject<any>();
  private stanardLessonSubject = new Subject<any>();
  private userlanguage: BehaviorSubject<any> = new BehaviorSubject('en');
  lessonId: number;
  lessonData: any;
  selectedClassId: any;
  selectedClassAccessCode: any;
  assignLessonData: any;
  assignmentId: any;
  viewFrom: any;
  reportTypeId: any;
  lessonType: any;
  standardLessonItem: any;
  teacherData: any;
  satndardLessonIds = [];
  public lessonList = [];
  public topRatedList = [];
  public viewMore: any;
  public lessonFilterType: String;
  public hideteacherHeader = false;

  constructor(private http: HttpClient) { }

  setTeachersHeader(flag) {

    this.hideteacherHeader = flag;
  }

  setLessonId(data) {
    this.lessonId = data;
  }
  getLessonId() {
    return this.lessonId;
  }

  setAssignmentId(data) {
    this.assignmentId = data;
  }
  getAssignmentId() {
    return this.assignmentId;
  }
  setViewFrom(data) {
    this.viewFrom = data;
  }
  getViewFrom() {
    return this.viewFrom;
  }

  setSelectedClassId(data) {
    this.selectedClassId = data;
  }
  getSelectedClassId() {
    return this.selectedClassId;
  }

  setSelectedClassAccesCode(data) {
    this.selectedClassAccessCode = data;
  }

  getSelectedClassAccesCode() {
    return this.selectedClassAccessCode;
  }

  setLessonData(data) {
    this.lessonData = data;
  }

  getLessonData() {
    return this.lessonData;
  }

  setAssignLessonData(data) {
    this.assignLessonData = data;
  }
  getAssignLessonData() {
    return this.assignLessonData;
  }

  setReportId(data) {
    this.reportTypeId = data;
  }
  getReportId() {
    return this.reportTypeId;
  }

  setLessonType(data) {
    this.lessonType = data;
  }
  GetLessonType() {
    return this.lessonType;
  }

  setStandardLessons(data) {
    this.standardLessonItem = data;
  }
  GetStandardLessons() {
    return this.standardLessonItem;
  }


  setTeacherDetails(data) {
    this.teacherData = data;
  }
  GetTeacherDetails() {
    return this.teacherData;
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

  getUserLanguage(): Observable<any> {
    return this.userlanguage.asObservable();
  }
  setUserLanguage(lang: any) {
    this.userlanguage.next(lang);
  }

  sendReportTypeId(id: any) {
    this.reportTypeSubject.next({ reportTypeId: id });
  }

  getReportTypeId(): Observable<any> {
    return this.reportTypeSubject.asObservable();
  }

  sendNotificationCount(id: any) {
    this.subject.next({ notificationCount: id });
  }

  getNotificationCount(): Observable<any> {
    return this.subject.asObservable();
  }

  sendFilteredAllLessonData(data: any) { // Sidebar AllData
  
    this.allLessonSubject.next({ allLessonData: data });
  }

  getFilteredALLLessonData(): Observable<any> { /// 
    return this.allLessonSubject.asObservable();
  }

  sendFilteredLessonData(data: any) { ////// used Sidbar Feature
    this.lessonSubject.next({ lessonData: data });
  }

  getFilteredLessonData(): Observable<any> {
    return this.lessonSubject.asObservable();
  }

  sendFilteredTopRatedLessonData(data: any) {
    this.topRatedLessonSubject.next({ topRatedData: data });
  }

  getFilteredTopRatedLessonData(): Observable<any> {
    return this.topRatedLessonSubject.asObservable();
  }

  sendFilteredSuggestedForYouLessonData(data: any) {
    this.suggestedForYouLessonSubject.next({ suggestedForYouData: data });
  }

  getFilteredSuggestedForYouLessonData(): Observable<any> {
    return this.suggestedForYouLessonSubject.asObservable();
  }


  sendFilteredStanardLessonData(data: any) {
    this.stanardLessonSubject.next({ standardData: data });
  }

  getFilteredStanardLessonData(): Observable<any> {
    return this.stanardLessonSubject.asObservable();
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

  getParentRoleId(id) {
    return this.http.get<any[]>(`${API_USERS_URL}/userrole/${id}`);
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
  * To get district profile and agent profile.
  */
  getTeacherProfile(id: number): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/teacher/${id}`);
  }

  /**
  * To update district/agent Profile details.teacher
  */
  updateTeacherProfile(id: number, submission: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/teacher/${id}`, submission);
  }
  //get class students data
  getStudentData(classId) {
    return this.http.get<any[]>(`${API_USERS_URL}/class/${classId}`);
  }
  /**
  * To get list of all lessons.
  */
  getAllLessons(viewstatus): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson?viewMore=${this.viewMore}`);
  }

  getAllLessonsMore(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson?viewMore=${true}`);
  }

  getFeaturedLessons(viewstatus): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson?isFeatured=true&viewMore=${this.viewMore}`);
  }

  getTopRatedLessons(viewstatus): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson/topRated?viewMore=${this.viewMore}`);
  }

  getSuggestedForYouLessons(viewstatus): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson/suggestedForYou?viewMore=${this.viewMore}`);
  }

  getStandardsList(viewstatus): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson/standard?viewMore=${this.viewMore}`);
  }

  getaAllStandardsList(lessonIds): Observable<any> {
    this.satndardLessonIds = lessonIds;
    return this.http.get<any[]>(`${API_USERS_URL}/lesson/standardLessons?lessonIds=${lessonIds}`);
  }




  getStudentStandardList(assignmentId,classId,studentId):Observable<any>{
    return this.http.get<any[]>(`${API_USERS_URL}/report/studentStandardReport?assignmentIds=${assignmentId}&classId=${classId}&studentId=${studentId}`);
  }

  findLesson(param, searchBy): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson/find?searchParam=${param}&searchBy=${searchBy}`);
  }

  getLessonById(id) {
    return this.http.get<any[]>(`${API_USERS_URL}/lessonById/${id}`);

  }

  /**
 * To get list of all lessons.
 */
  getRecipes(id: number): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/lesson/${id}`);
  }

  /**
     * To get list of all lessons.
     */
  getClassesList(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/class`);
  }

  assignLesson(obj) {
    return this.http.post<any>(`${API_USERS_URL}/lesson/assign`, obj);
  }

  editLesson(id: number, obj) {
    return this.http.put<any>(`${API_USERS_URL}/assignment/${id}`, obj);
  }

  customList() {
    return this.http.get<any>(`${API_USERS_URL}/lesson/customSettingList`);
  }

  /**
* To check lesson Title already exists/not
* 
*/
  titleSettingValidator(name: string, label: string): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/lessonTitleConflict`, { name, label });
  }

  // Join class
  joinClass(data) {
    return this.http.post<any>(`${API_USERS_URL}/class/joinClass`, data);
  }

  /**
* To Archive Class
*/
  archiveClass(id: number): Observable<any> {
    return this.http.put(`${API_USERS_URL}/class/archieve/${id}`, '');
  }

  /**
* To UnArchive Class
*/
  unArchiveClass(id: number): Observable<any> {
    return this.http.put(`${API_USERS_URL}/class/unArchieve/${id}`, '');
  }


  /**
* To delete class.
*/
  deleteClass(id: any): Observable<any> {
    return this.http.delete<any[]>(`${API_USERS_URL}/Class/delete/${id}`);
  }

  getArchieveClassList() {
    return this.http.get<any>(`${API_USERS_URL}/class?archieve=1`);
  }

  getCurrentAssignmentList(id) {
    return this.http.get<any>(`${API_USERS_URL}/assignment?classId=${id}`);
  }

  getColorList() {
    return this.http.get<any>(`${API_USERS_URL}/master/groupcolors`);
  }

  getClassGroup(id: number): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/class/${id}`);
  }

  postNewGroup(obj): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/teacher/classGroup`, obj);
  }
  getBillingDetails(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/payment/${id}`)

  }

  getSubscriptionPackageById(id: any): Observable<any> {
    return this.http.get<any>(`${API_CMS_ADMIN}/subscriptionPackage/${id}`)
  }

  getSubscribePackageDetails(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/subscribePackage/${id}`)
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
    params = params.append('fields[subscription_package_plans]', `["id","priceId"]`);
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
    params = params.append('filters[root]', `[${packge},${sts},${role}]`);
    if (customFields) {
      params = params.append('fields[root]', `["id","price","packageTitle","priceId","validityFrom","validityTo"]`);
    }
    //  params= params.append('fields[subscription_package_plans]',`["id","priceId"]`);
    return this.http.get<any[]>(url, { params });
  }

  createSubscriptionPackage(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/subscribePackage`, data);
  }

  createStripePaymentSession(data, token): Observable<any> {
    return this.http.post(`${API_USERS_URL}/payment/session`, data)
  }

  /**
  * To Bookmark lesson
  */
  bookmarkLesson(id: number, data): Observable<any> {
    return this.http.put(`${API_USERS_URL}/lesson/bookmark/${id}`, data);
  }
  getBookmarkedLessonList() {
    return this.http.get<any>(`${API_USERS_URL}/lesson?isBookmarked=1`);
  }

  getAllGroupList(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/teacher/classGroup/${id}`)
  }


  getAllGroupMenus(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/teacher/groupName/${id}`)
  }
  /**
* To delete group.
*/
  removeClassGroup(id: any): Observable<any> {
    return this.http.delete<any[]>(`${API_USERS_URL}/teacher/classGroup/${id}`);
  }

  /**
* To update group.
*/
  updateClassGroup(id: any, obj): Observable<any> {
    return this.http.put<any[]>(`${API_USERS_URL}/teacher/classGroup/${id}`, obj);
  }

  teacherInstructions(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/assignment/teacherInstruction/${id}`)
  }

  getStudentDetails(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/student/${id}`)
  }

  getStudentJournalDetails(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/student/journalNotes/${id}`)
  }

  /**
* To check unique group color and title
* 
*/
  validateColorAndTitle(obj): Observable<any> {
    return this.http.post<any>(`${API_USERS_URL}/checkColorAndTitleConflict`, obj);
  }

  getFilterMasters(): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/master/lessonFilters`)
  }

  getAllFilteredLessons(obj) {
    return this.http.get<any>(`${API_USERS_URL}/lesson?filters=${obj}&viewMore=${this.viewMore}`);
  }

  getFilteredLessons(obj) {
    return this.http.get<any>(`${API_USERS_URL}/lesson?isFeatured=true&filters=${obj}&viewMore=${this.viewMore}`);
  }

  getFilteredTopRatedLessons(obj) {
    return this.http.get<any>(`${API_USERS_URL}/lesson/topRated?filters=${obj}&viewMore=${this.viewMore}`);
  }

  getFilteredStandardLesson(obj) {
    return this.http.get<any>(`${API_USERS_URL}/lesson/standardLessons?lessonIds=${this.satndardLessonIds}&filters=${obj}&viewMore=${this.viewMore}`);
  }

  getActiveSubscribePackageDetails(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/active/subscribePackage/${id}`)
  }

  removeAssignment(id: any): Observable<any> {
    return this.http.delete<any[]>(`${API_USERS_URL}/assignment/${id}`);
  }

  getCountStudents(id: any, roleId: any, packageId: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/count/student?id=${id}&roleId=${roleId}&packageId=${packageId}`)
  }


  getUserDetailsByID(id: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/district/profile/${id}`)
  }

  verifyMaxUserCountClass(id: any, roleId: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/verifyMaxUser?id=${id}&roleId=${roleId}`)
  }

  getLessonInfo(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/lessonInfo/${id}`)
  }

  getPerformanceCatgList(duration: any, id: any, studentId: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/report/category/${id}?duration=${duration}&studentId=${studentId}`)
  }

  getReportList(assignmentids, classId, questionTypeKey): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/report/byAssignment?assignmentIds=${assignmentids}&classId=${classId}&questionTypeKey=${questionTypeKey}`);
  }

  getStandardReportList(assignmentids, classId, questionTypeKey): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/report/reportByStandard?classId=${classId}&assignmentIds=${assignmentids}&questionTypeKey=${questionTypeKey}`);
  }

  getStudentStandardReport(assignmentids, classId, questionTypeKey, studentId) {
    return this.http.get<any>(`${API_USERS_URL}/report/studentStandardReport?classId=${classId}&assignmentIds=${assignmentids}&questionTypeKey=${questionTypeKey}&studentId=${studentId}`);
  }

  getClassStudentReport(duration, classId): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/report/byStudent/${classId}?duration=${duration}`);
  }

  getNeedHelpStudentList(classId): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/teacherDashboard/needHelpStudents/${classId}`);
  }

  getPractiseAndGrowthReport(classId): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/teacherDashboard/practiceAndGrowth/${classId}`);
  }

  getGrowthReport(classId): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/teacherDashboard/growthReport/${classId}`);
  }

  getSessionReport(classId): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/teacherDashboard/dashboardTimeSpent/${classId}`);
  }
  /**
  * To add discussion forums details
  */
  addDiscussionForumDetails(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/discussionForum`, data);
  }
  /**
  * To get all discussion forums.
  */
  getAllDiscussionForumTopics(): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/discussionForum`);
  }

  deleteReply(id: string): Observable<any> {
    return this.http.delete<any[]>(`${API_USERS_URL}/reply/${id}`);
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

  /**
  * To get all replies by comment Id.
  */
  getReplies(id: string): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/reply/${id}`);
  }

  deleteComment(id: string): Observable<any> {
    return this.http.delete<any[]>(`${API_USERS_URL}/comments/${id}`);
  }


  addReply(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/reply`, data);
  }


  addComment(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/comments`, data);
  }


  updateVote(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/vote`, data)

  }

  addVote(id: any, data: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/vote/${id}`, data);
  }


  getVote(discussionForumId: any): Observable<any> {
    return this.http.get(`${API_USERS_URL}/vote/${discussionForumId}`)
  }

  getAssignmentStudentList(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/report/byAssignment/${id}`)
  }
  getAssignmentStudentReport(id: any, assignmentId: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/report/studentReport/${id}?assignLessonId=${assignmentId}`)
  }

  saveAnswers(obj) {
    return this.http.put<any>(`${API_USERS_URL}/report/updateAnswer`, obj);
  }

  emitNavChangeEvent(number) {
    this.navchange.emit(number);
  }
  getNavChangeEmitter() {
    return this.navchange;
  }
  getIngredientsList(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/assignment/recipeIngredients/${id}`)
  }

  getIngredientSubstitute(id: any): Observable<any> {
    return this.http.get<any>(`${API_USERS_URL}/assignment/substitue/${id}`)
  }
  archiveAssignmentLesson(id: number): Observable<any> {
    return this.http.put(`${API_USERS_URL}/assignment/archieve/${id}`, '');
  }
  
  syncClassesByTeacher(userId: number, email: string): Observable<any> {
    return this.http.post(`${API_USERS_URL}/clever/teacher/sync-data`, { userId, email });
  }

}
