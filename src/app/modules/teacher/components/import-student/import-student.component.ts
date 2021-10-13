import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { saveAs } from 'file-saver';
import {
  faAngleLeft,
  faFile
} from '@fortawesome/free-solid-svg-icons';
import { StudentsService } from '@modules/teacher/services/students.service';
import { ClassesService } from '@modules/teacher/services/classes.service';

@Component({
  selector: 'app-import-student',
  templateUrl: './import-student.component.html',
  styleUrls: ['./import-student.component.scss']
})
export class ImportStudentComponent implements OnInit {
  LeftArrow = faAngleLeft;
  fileIcon = faFile;
  localData: any;
  teacherData = {
    districtId: '',
    schoolId: ''
  }
  constructor(private router: Router,
    private toast: ToasterService,
    private classService: ClassesService,
    private studentService: StudentsService) {
  }
  selectedFileName: string;
  fileNameToSave: string;
  progress = 0;
  ngOnInit(): void {
    this.localData = JSON.parse(window.sessionStorage.getItem('currentUser'));


    this.getTeacherData();

  }


  getTeacherData() {
    this.classService.getTeacherData(this.localData.id).subscribe((response: any) => {
      if (response && response.data) {
        console.log(response.data);

        if (response.data.teacher.district_id)
          this.teacherData.districtId = response.data.teacher.district_id;


        if (response.data.teacher.school)
          this.teacherData.schoolId = response.data.teacher.school.id;
      }
    }, (error) => {
      console.log(error);
      this.toast.showToast(error.error.message, '', 'error');
    });
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
      this.onUploadFile(event.target.files);
    }
  }

  /**
 * To download sample .xlsx, .xls, .csv file
 */
  onDownloadFile(): void {
    // let type = this.importType === 'Users' ? 'districtUsers' : this.importType.toLowerCase();
    let type = 'studnet';
    this.studentService.downloadFile(type).subscribe(
      (response) => {
        if (response) {
          saveAs(window.URL.createObjectURL(response), `${type}.xlsx`);
          this.toast.showToast('File downloaded Successfully', '', 'success');
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast('Something went wrong', '', 'error');
      }
    );
  }

  onUploadFile(files: any): void {
    let formData = new FormData();

    if (this.teacherData.districtId) formData.append('districtId', this.teacherData.districtId);
    if (this.teacherData.schoolId) formData.append('schoolId', this.teacherData.schoolId);

    for (let item of files) {
      formData.append('fileName', item);
    }
    this.studentService.fileUpload(formData).subscribe(
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
    this.studentService.inserBulkData(
      this.fileNameToSave
    ).subscribe((event: HttpEvent<any>) => {
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
          this.toast.showToast(`${this.fileNameToSave} uploaded successfully`, '', 'success');
          setTimeout(() => {
            // this.progress = 0; //Set to 0 after successfully upload. 
          }, 1500);
      }
    }, (error: HttpErrorResponse) => {
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
  /**
   * on click of cancel/back
   */
  onCancel(): void {
    this.router.navigate(['/teacher/student-list']);
  }

  /**
   * on file clear
   */
  clearFile(): void {
    this.fileNameToSave = undefined;
    this.selectedFileName = undefined;
    this.progress = 0;
  }
}
