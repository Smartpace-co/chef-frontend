import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  faAngleDoubleRight,
  faAngleDoubleLeft,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { StudentService } from '@modules/student/services/student.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';
import { AuthService } from '@modules/auth/services/auth.service';
import { environment } from '@environments/environment';
import { UtilityService } from '@appcore/services/utility.service';
declare var Stripe;
@Component({
  selector: 'app-student-sign-up',
  templateUrl: './student-membership.component.html',
  styleUrls: ['./student-membership.component.scss']
})
export class StudentMembershipComponent implements OnInit {
  LeftArrow = faAngleDoubleLeft;
  rightArrow = faAngleDoubleRight;
  closeModal;
  stripe: any;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '<div class=\'nav-btn plan-next-slide\'></div>',
    prevArrow: '<div class=\'nav-btn plan-prev-slide\'></div>',
    dots: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 580,

        settings: {
          slidesToShow: 1
        }
      }
    ]
  };
  planList = [];
  isLoad = true;
  currentStudent;
  selectedPlan;
  constructor(private utilityService:UtilityService,private toast: ToasterService, private authService: AuthService, private studentService: StudentService, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.stripe = Stripe(environment.public_key);
    this.studentService.getFormData().subscribe(ob => this.currentStudent = ob);
    if (this.currentStudent && this.currentStudent.token) {
      this.getPackageList();
    }
  }

  getSliderConfig(): void {
    this.slideConfig = {
      slidesToShow: this.planList.length >= 3 ? 3 : this.planList.length,
      slidesToScroll: 1,
      nextArrow: '<div class=\'nav-btn plan-next-slide\'></div>',
      prevArrow: '<div class=\'nav-btn plan-prev-slide\'></div>',
      dots: false,
      infinite: false,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 580,

          settings: {
            slidesToShow: 1
          }
        }
      ]
    };
  }
  /**
   * To get all PackageList.
   */
  getPackageList(): void {
    let customFields = true;
    let pId = this.currentStudent.packageId ? this.currentStudent.packageId : undefined;
    let isPrivate = pId ? true : false;
    this.authService.getAllPackageList(isPrivate, this.currentStudent.token, pId, customFields, this.currentStudent.roleId).subscribe(
      (res) => {
        let allPackages = [];
        if (res) {
          if (_.isArray(res.data)) {
            allPackages = res.data;
          } else {
            allPackages = [res.data];
          }
          this.planList = _.map(allPackages, item => {
            let obj = {
              id: item.id,
              planName: item.packageTitle,
              totalPrice: item.price,
              priceId:item.priceId
            }
            return obj;
          });
          if (pId) {
            this.selectedPlan = this.planList[0];
          }
          this.getSliderConfig();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  open(content, item) {
    this.selectedPlan = this.planList.find(o => o.id === item.id);
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'membership-modal' });
  }
  closePopup(): void {
    this.closeModal.close();
  }
  onPrevious(): void {
    if (this.currentStudent && this.currentStudent.queryParamUrl) {
      this.router.navigate(['/auth/student-signup'], { queryParams: this.currentStudent.queryParamUrl });
    } else {
      this.router.navigate(['/auth/student-signup']);
    }
  }
  onSignUp(): void {
    let temp = [];
    let tempAllergens = [];
    let submission = {};
    if (this.currentStudent && this.currentStudent.token && this.currentStudent.isValidForm && this.selectedPlan.id) {
      submission['lastName'] = this.currentStudent.lastName;
      submission['firstName'] = this.currentStudent.firstName;
      submission['userName'] = this.currentStudent.userName;
      submission['contactPersonName'] = this.currentStudent.contactPersonName;
      submission['contactPersonNumber'] = this.currentStudent.contactPersonNumber;
      submission['customSchoolName'] = this.currentStudent.school;
      submission['gender'] = this.currentStudent.gender ? this.currentStudent.gender.menu : undefined;
      submission['ethnicityId'] = this.currentStudent.ethnicity ? this.currentStudent.ethnicity.id : undefined;
      submission['contactPersonRelationId'] = this.currentStudent.relationship ? this.currentStudent.relationship.id : undefined;
      submission['contactPersonEmail'] = this.currentStudent.contactPersonEmail;
      _.forEach(this.currentStudent.medicalCondition, ob => {
        temp.push(ob.item_id);
      });
      submission['medicalConditionIds'] = temp;
      submission['dob'] = this.utilityService.formatDate(this.currentStudent.dob);
      submission['gradeId'] = this.currentStudent.grade.id;
      _.forEach(this.currentStudent.allergens, ob => {
        tempAllergens.push(ob.item_id);
      });
      submission['allergenIds'] = tempAllergens;
      submission['customDistrictName'] = this.currentStudent.district;
      submission['packageId'] = this.selectedPlan.id;
      submission['roleId'] = this.currentStudent.roleId;
      this.studentService.studentRegister(submission, this.currentStudent.token).subscribe(
        (dt) => {
          if (dt) {
            let stripeData = {
              subscribeId: dt.data.subscribeId,
              customerId: dt.data.customerId,
              priceId: this.selectedPlan.priceId
            }

            this.authService.createStripePaymentSession(stripeData, this.currentStudent.token).subscribe((dt) => {
              setTimeout(() => {
                this.toast.showToast('Yay! You just successfully signed up for Chef Koochooloo! Check your email for next steps.', '', 'success');
                this.router.navigate(['/auth/login']);
              }, 1000);
              /*   this.stripe.redirectToCheckout({
                sessionId: dt.data,
              }) */
            })
            // this.toast.showToast('Student registered successfully', '', 'success');
            // this.router.navigate(['/']);
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    } else {
      this.toast.showToast('Please enter information for required fields', '', 'error');
    }
  }
  isInvalid(): boolean {
    if (this.currentStudent && this.currentStudent.isValidForm && this.currentStudent.token && this.selectedPlan && this.selectedPlan.id) {
      return false;
    } else {
      return true;
    }
  }
}
