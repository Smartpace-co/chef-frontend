import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '@environments/environment';
const API_USERS_URL = `${environment?.apiBaseUrl}`;

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  constructor(private http: HttpClient) { }

  getStudentData() {
    // return this.http.get<any[]>('assets/JSON/student-list.JSON');
    return this.http.get<any[]>(`${API_USERS_URL}/student`);
  }

  getStudentById(id) {
    // return this.http.get<any[]>('assets/JSON/student-list.JSON');
    return this.http.get<any[]>(`${API_USERS_URL}/student/${id}`);
  }

  filterStudentData(param) {
    return this.http.get<any[]>(`${API_USERS_URL}/student?search=${param}`);
  }

  checkUserNameConflict(data) {
    // return of("student added successfully");
    return this.http.post<any[]>(`${API_USERS_URL}/checkUserNameConflict`, data);
  }

  addStudent(data) {
    // return of("student added successfully");
    return this.http.post<any[]>(`${API_USERS_URL}/student`, data);
  }

  editStudentDetails(id: any, studentData: any): Observable<any> {
    return this.http.put(`${API_USERS_URL}/student/${id}`, studentData);
  }

  getDistrictList() {
    return this.http.get<any[]>(`${API_USERS_URL}/districts`);
  }

  getSchoolList(districtId, schoolId) {
    return this.http.get<any[]>(`${API_USERS_URL}/schoolById?districtId=${districtId}&schoolId=${schoolId}`);
  }

  getClassBySchoolList(schoolId) {
    return this.http.get<any[]>(`${API_USERS_URL}/classBySchool/${schoolId}`);
  }

  getClassList() {
    return this.http.get<any[]>(`${API_USERS_URL}/class`);
  }

  getGradesList() {
    return this.http.get<any[]>(`${API_USERS_URL}/master/grade`);
  }

  getRelationshipList() {
    return this.http.get<any[]>(`${API_USERS_URL}/master/relation`);
  }

  getAllergensList() {
    return this.http.get<any[]>(`${API_USERS_URL}/master/allergen`);
  }

  getMedicalConditionList() {
    return this.http.get<any[]>(`${API_USERS_URL}/master/medicalcondition`);
  }

  getEthnicityList() {
    return this.http.get<any[]>(`${API_USERS_URL}/master/ethnicity`);
  }

  getAllMasterRoleDetails() {
    return this.http.get<any[]>(`${API_USERS_URL}/masterrole`);
  }

  /**
 * To download sample .xlsx, .xls, .csv file
 * @param type 
 */
  downloadFile(type: string) {
    return this.http.get(`${API_USERS_URL}/demofile/${type}`, { responseType: "blob" })
  }

  /**
    * To insert user data in bulk.
    * @param data 
    */
  inserBulkData(data: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/student/file`, { file_name: data }, {
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

  verifyMaxStudent(id: any, roleId: any): Observable<any> {
    return this.http.get<any[]>(`${API_USERS_URL}/verifyMaxStudent?id=${id}&roleId=${roleId}`);
  }
}
