import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { DistrictService } from '@modules/district/services/district.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';
import { environment } from '@environments/environment';

declare var Stripe;
@Component({
  selector: 'app-edit-member-ship',
  templateUrl: './edit-membership.component.html',
  styleUrls: ['./edit-membership.component.scss']
})
export class EditMemberShipComponent implements OnInit {
  @ViewChild('proceedDeleteClassModal') proceedDeleteClassModal: ElementRef;
  LeftArrow = faAngleDoubleLeft;
  rightArrow = faAngleDoubleRight;
  closeModal;
  closeModal1;
  classCount: any;
  maxUserCount: any;
  removeClassesCount: any;
  packageId: number;
  selectedPackageMaxUserCount: any;
  allPackages = [];
  queryParamObj;
  stripe: any;
  slideConfig: any = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: "<div class='nav-btn plan-next-slide'></div>",
    prevArrow: "<div class='nav-btn plan-prev-slide'></div>",
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
  constructor(
    private toast: ToasterService,
    private districtService: DistrictService,
    private modalService: NgbModal,
    private router: Router
  ) {}
  planList = [];
  isLoad = true;
  currentLoggedUser;
  selectedPlan;
  ngOnInit(): void {
    this.stripe = Stripe(environment.public_key);
    this.currentLoggedUser = JSON.parse(window.sessionStorage.getItem('currentUser'));
    if (this.currentLoggedUser && this.currentLoggedUser.token) {
      this.getPackageList();
    }
  }

  getSliderConfig(): void {
    this.slideConfig = {
      slidesToShow: this.planList.length >= 3 ? 3 : this.planList.length,
      slidesToScroll: 1,
      nextArrow: "<div class='nav-btn plan-next-slide'></div>",
      prevArrow: "<div class='nav-btn plan-prev-slide'></div>",
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
    this.packageId = this.queryParamObj && this.queryParamObj.packageId ? parseInt(this.queryParamObj.packageId) : undefined;
    let isPrivate = this.packageId ? true : false;
    var date=new Date();

    if (this.currentLoggedUser.token) {
      this.districtService
        .getPackageListForEdit(isPrivate, this.currentLoggedUser.token, this.packageId, customElements, this.currentLoggedUser.role.id)
        .subscribe(
          (res) => {
            let notUndefined;

            if (res && res.data) {
              if (_.isArray(res.data)) {
                this.allPackages = res.data;
              } else {
                this.allPackages = [res.data];
              }
              this.planList = _.map(this.allPackages, (item) => {
                let obj ;
                notUndefined= obj => typeof obj !== 'undefined'  
                if(date.getMonth()+1<=item.validityTo && date.getMonth()+1>=item.validityFrom)
                {
                obj = {
                  id: item.id,
                  menu: item.packageTitle,
                  price: item.price,
                  priceId:item.priceId

                };
              }
                return obj;
              }).filter(notUndefined);
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }

    (error) => {
      console.log(error);
    };
  }

  open(content, item) {
    this.selectedPlan = this.planList.find((o) => o.id === item.id);
    this.closeModal = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'membership-modal'
    });
  }
  closePopup(): void {
    this.closeModal1.close();
  }
  onPrevious(): void {
    this.router.navigate(['district/membership-details']);
  }
  onSelectedPackage(): void {
    this.districtService.getDistrictProfile().subscribe((res) => {
      if (res && res.data) {
        this.districtService.getClassCount(res.data.id, this.currentLoggedUser.role.id, this.selectedPlan.id).subscribe((res1) => {
          this.classCount = res1.data.count;
          this.maxUserCount = res1.data.maxUserCount;
          this.selectedPackageMaxUserCount = res1.data.selectedPackageMaxUserCount;
          if (this.classCount > this.selectedPackageMaxUserCount) {
            this.removeClassesCount = this.maxUserCount - this.selectedPackageMaxUserCount;
            /*if(this.removeClassesCount==0)
            {
              this.removeClassesCount=1
            }*/
            this.closeModal1 = this.modalService.open(this.proceedDeleteClassModal, {
              ariaLabelledBy: 'modal-basic-title',
              centered: true,
              windowClass: 'proceed-delete-class-modal'
            });
          } else {
            var submission = {
              subscribeId: this.currentLoggedUser.subscribeId,
              entityId: res.data.id,
              packageId: this.selectedPlan.id,
              roleId: this.currentLoggedUser.role.id
            };
            this.districtService.createSubscriptionPackage(submission).subscribe((res) => {
              if (res && res.data) {
                this.currentLoggedUser['subscribeId'] = this.currentLoggedUser[res.data.id];
                sessionStorage.setItem('currentUser', JSON.stringify(this.currentLoggedUser));
                let stripeData = {
                  subscribeId: res.data.id,
                  customerId: this.currentLoggedUser.customerId,
                  priceId: this.selectedPlan.priceId
                };

                this.districtService.createStripePaymentSession(stripeData, this.currentLoggedUser.token).subscribe((dt) => {
                  this.stripe.redirectToCheckout({
                    sessionId: dt.data
                  });
                });
              }
            });
          }
        });
      }
    });
  }
  isInvalid(): boolean {
    if (this.currentLoggedUser && this.currentLoggedUser.token && this.selectedPlan && this.selectedPlan.id) {
      return false;
    } else {
      return true;
    }
  }

  onProceed() {
    this.closePopup();
    this.router.navigate(['/district/admin-classes']);
  }
}
