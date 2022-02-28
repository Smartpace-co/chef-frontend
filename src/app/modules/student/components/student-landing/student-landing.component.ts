import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import {
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@modules/auth/services/auth.service';
import { StudentService } from '@modules/student/services/student.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { PassportComponent } from '../passport/passport.component';

@Component({
  selector: 'app-student-landing',
  templateUrl: './student-landing.component.html',
  styleUrls: ['./student-landing.component.scss']
})
export class StudentLandingComponent implements OnInit {
  RightArrow = faChevronRight;
  closeModal;
  classList = [];
  showBadgeNoti = false;
  constructor(private router: Router, private authService: AuthService,private modalService: NgbModal, private toast: ToasterService, private studentService: StudentService) { }

  ngOnInit(): void {
    this.getBadgeNotification();
    this.authService.setuserlang();
  }

  gotoHomePage() {
    this.studentService.getAllClasses().subscribe(
      (response) => {
        if (response && response.data && response.data.count === 1) {
          this.router.navigate([`/student/class-details/${response.data.rows[0].id}`]);
        } else {
          this.router.navigate(['/student/class-info']);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  open(content) {
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'landing-popup' });
  }
  closeOpenModal() {
    this.closeModal.close();
  }

  openPassportModal(): void {
    const modalRef = this.modalService.open(PassportComponent, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'passport-profile' });
    modalRef.componentInstance.name = 'Passport';
  }

  getBadgeNotification(): void {
    this.studentService.getDashboardNotification().subscribe(
      (response) => {
        if (response && response.data) {
          this.showBadgeNoti = response.data.displayNewStampAlert;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
}
