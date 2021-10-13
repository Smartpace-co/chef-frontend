import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';

import { faAngleLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PassportComponent } from '../passport/passport.component';

@Component({
  selector: 'app-locker-room',
  templateUrl: './locker-room.component.html',
  styleUrls: ['./locker-room.component.scss']
})
export class LockerRoomComponent implements OnInit {
  LeftArrow = faAngleLeft;

  lessonHederConfig = {};
  assignmentId: string;
  sessionData: any;
  assignmentData: any;
  allItemList = [];
  RightArrow = faChevronRight;
  closeModal;
  constructor(private modalService: NgbModal, private studentService: StudentService, private toast: ToasterService, private router: Router) { }

  ngOnInit(): void {
    this.getAllItems();
  }

  getAllItems(): void {
    this.studentService.getLockerItems()
      .subscribe((response) => {
        if (response && response.data.length > 0) {
          this.allItemList = response.data;
        } else {
          this.toast.showToast('No items in your locker room', '', 'warning');
        }
      },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
  }

  goToPassport(): void {
    const modalRef = this.modalService.open(PassportComponent, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'passport-profile' });
    modalRef.componentInstance.name = 'Passport';
  }
}
