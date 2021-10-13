import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  faInfo,
  faChevronRight,
  faAngleLeft
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { StudentService } from '@modules/student/services/student.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-class-info',
  templateUrl: './class-info.component.html',
  styleUrls: ['./class-info.component.scss']
})
export class ClassInfoComponent implements OnInit {
  infoCircleIcon = faInfo;
  RightArrow = faChevronRight;
  LeftArrow = faAngleLeft;
  closeResult = '';
  classDetails: any;
  opnedPopup = false;
  classInfo;
  closeModal;
  isLoad = false;
  classInfoList = [];
  classTime;
  constructor(private studentService: StudentService, private modalService: NgbModal, private router: Router, private toast: ToasterService) { }
  ngOnInit(): void {
    this.getClassList();
  }

  getClassList() {
    let stdList = [];
    this.studentService.getAllClasses().subscribe(
      (response) => {
        if (response && response.data && response.data && response.data.rows) {
          this.classInfoList = _.map(response.data.rows, cls => {
            if (cls && cls.class_standards && cls.class_standards.length > 0) {
              _.forEach(cls.class_standards, item => {
                stdList.push(item.standardTitle);
              });
            }
            let obj = {
              id: cls.id,
              name: cls.title,
              teachers: cls.class_teachers ? cls.class_teachers.length : undefined,
              schoolName: cls.school && cls.school.name ? cls.school.name : undefined,
              grade: cls.grade.grade,
              standards: stdList ? stdList.join(',') : undefined,
              image: './assets/images/class-info.png',
              createdAt: cls.createdAt,
              status: cls.status === true ? 'Active' : 'Inactive',
            };
            return obj;
          });
        };
        this.isLoad = true;
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  open(content, item) {
    this.classDetails = this.classInfoList.find(o => o.id === item.id);
    this.opnedPopup = true;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.opnedPopup = false;
    }, (reason) => {
      this.opnedPopup = false;
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onCardClick(id: any): void {
    if (id && !this.opnedPopup) {
      this.router.navigate([`/student/class-details/${id}`]);
    }
  }

  viewAssignedLessons(id: any): void {
    this.router.navigate([`/student/assignment`], { queryParams: { id } });
  }
}
