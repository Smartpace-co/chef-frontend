import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import {
  faAngleLeft,
  faFile
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@modules/auth/services/auth.service';
import { SchoolService } from '@modules/school/services/school.service';
import * as _ from 'lodash';
import { saveAs } from 'file-saver';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-import-user',
  templateUrl: './import-user.component.html',
  styleUrls: ['./import-user.component.scss']
})
export class ImportUserComponent implements OnInit {
  LeftArrow = faAngleLeft;
  fileIcon = faFile;
  importType: string;
  parent_id: any;

  constructor(private router: Router, private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toast: ToasterService,
    private schoolService: SchoolService) {
    if (this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams) {
      this.importType = this.activatedRoute.snapshot.queryParams.type;
    }
  }
  selectedFileName: string;
  fileNameToSave: string;
  progress = 0;
  teacherRole: any;
  schoolDetails: any;
  activateUserData: any;
  ngOnInit(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.getMasterRoles();
    this.getSchoolDetails();
    if(this.activateUserData.parentId!=null)
    {
      this.parent_id=this.activateUserData.parentId

    }
    else
    {
      this.parent_id=this.activateUserData.id

    }

  }

  /**
   * to get teacher || student role_id from master;
   */
  getMasterRoles(): void {
    this.authService.getAllMasterRoleDetails().subscribe(
      (response) => {
        if (response && response.data) {
          this.teacherRole = response.data.find(o => o.title.toLowerCase() === 'teacher');
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * on click of browse
   * @param event 
   */
  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.selectedFileName = event.target.files[0].name;
      this.onUploadFile(event.target.files);
    }
  }
  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    let droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      this.selectedFileName = droppedFiles[0].name;
      this.onUploadFile(droppedFiles);
    }
  }

  onUploadFile(files: any): void {
    let formData = new FormData();
    for (let item of files) {
      formData.append('file', item);
    }
    this.schoolService.fileUpload(formData).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.fileNameToSave = response.data[0].mediaName;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      });
  }

  /**
   * on click of upload
   */
  insertBulkRecords() {
    let apiRequest;
    let submission = {
      file_name: this.fileNameToSave
    }
    if (this.progress === 0) {
      if (this.importType === 'Users') {
        submission['parent_id'] = this.parent_id;
        apiRequest = this.schoolService.insertUserBulkData(submission)
        this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));

      } else if (this.importType === 'Teachers') {
        submission['district_id'] = this.schoolDetails.district_id;
        submission['school_id'] = this.schoolDetails.id;
        submission['role_id'] = this.teacherRole.id;
        submission['parent_id'] = this.parent_id;
        apiRequest = this.schoolService.insertTeacherBulkData(submission)
      } else if (this.importType === 'Students') {
        submission['districtId'] = this.schoolDetails.district_id;
        submission['schoolId'] = this.schoolDetails.id;
        submission['fileName'] = this.fileNameToSave;
        submission['parentId'] = this.parent_id;
        let finalSubmission = _.omit(submission, ['file_name']);
        apiRequest = this.schoolService.insertStudentBulkData(finalSubmission)
      } else {
      }
      apiRequest.subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            // console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            // console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            // console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            // console.log('upload successfully!', event.body);
            if (_.isEmpty(event.body.data.failed) && _.isEmpty(event.body.data.success)) {
              this.toast.showToast(`${this.selectedFileName} :has no records to be upload.`, '', 'warning');
              setTimeout(() => {
              }, 1500);
            } else {
              this.toast.showToast(`${this.selectedFileName} uploaded successfully`, '', 'success');
              setTimeout(() => {
                // this.progress = 0; //Set to 0 after successfully upload. 
              }, 1500);
            }
        }
      }, (error: HttpErrorResponse) => {
        console.log(error)
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;
        } else {
          // Get server-side error
          errorMessage = `Success records: ${error.error.data.success.length}\nFailed records: ${error.error.data.failed.length}`;
        }
        this.toast.showToast(`${errorMessage}`, `${error.error.message}`, 'info');
      })
    }
  }
  /**
   * on click of cancel/back
   */
  onCancel(): void {
    if (this.importType === 'Users') {
      this.router.navigate(['/school/admin-user']);
    } else if (this.importType === 'Teachers') {
      this.router.navigate(['/school/admin-teacher']);
    } else if (this.importType === 'Students') {
      this.router.navigate(['/school/admin-student']);
    } else {
    }
  }

  /**
   * on file clear
   */
  clearFile(): void {
    this.fileNameToSave = undefined;
    this.selectedFileName = undefined;
    this.progress = 0;
  }

  getSchoolDetails():void{
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.schoolService.getSchoolDetailsByUserId(this.activateUserData.id).subscribe(
      (response) => {
        if (response && response.data) {
          this.schoolDetails = response.data[0];
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
    return this.schoolDetails ;
  }

  /**
   * To download sample .xlsx, .xls, .csv file
   */
   onDownloadFile(): void {
    let filename = this.importType === 'Users' ? 'schoolUsers' : this.importType.toLowerCase();
    if (this.importType === 'Teachers') {
      filename = 'teachers';
    } else if (this.importType === 'Students') {
      filename = 'students';
    }
    saveAs(environment.bucketUrl + `/uploads/` + `${filename}.xlsx`, `${this.importType}.xlsx`);
    this.toast.showToast('File downloaded Successfully', '', 'success');
  }
  
}
