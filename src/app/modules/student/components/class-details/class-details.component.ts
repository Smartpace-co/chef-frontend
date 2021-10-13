import { Component, OnInit } from '@angular/core';
import {
  faAngleLeft
} from '@fortawesome/free-solid-svg-icons';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '@modules/student/services/student.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UtilityService } from '@appcore/services/utility.service';
@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.scss']
})
export class ClassDetailsComponent implements OnInit {
  LeftArrow = faAngleLeft;
  closeResult = '';
  classDetails: any;
  sessionData: any;
  teacherDetails;
  classmates = [];
  teacherProfileImg;
  schoolProfileImg;
  schoolDetails;
  studentProfileImg;
  isLoad = false;
  classId;
  standards;;
  constructor(private studentService: StudentService, private location: Location, private utilityService: UtilityService, private activatedRoute: ActivatedRoute, private modalService: NgbModal, private toast: ToasterService) {
    this.classId = this.activatedRoute && this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.id ? this.activatedRoute.snapshot.params.id : undefined;
  }

  ngOnInit(): void {
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    if (this.classId) {
      this.getClassDetails();
    }
  }

  getClassDetails() {
    let stdList = [];
    this.studentService.getClassById(this.classId).subscribe(
      (response) => {
        if (response && response.data && response.data) {
          this.classDetails = response.data;
          this.teacherDetails = response.data.class_teachers[0];
          this.teacherProfileImg = this.teacherDetails && this.teacherDetails.profile_image ? this.teacherDetails.profile_image : './assets/images/profile-icon-1.png';
          this.schoolDetails = response.data.school;
          this.schoolProfileImg = this.schoolDetails && this.schoolDetails.school_image ? this.schoolDetails.school_image : './assets/images/school.png';
          this.classmates = _.map(response.data.class_students, item => {
            let obj = {
              id: item.id,
              firstName: item.firstName,
              lastName: item.lastName,
              favourite: item.id === this.sessionData.id ? true : false,
              icon: item.profileImage ? item.profileImage : './assets/images/user-profile.png'
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
  onBack(): void {
    this.location.back();
  }
}
