import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { faAngleLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

@Component({
  selector: 'app-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.scss']
})
export class PassportComponent implements OnInit {

  LeftArrow = faAngleLeft;

  constructor(public activeModal: NgbActiveModal, private router: Router, private studentService: StudentService, private toast: ToasterService) { }
  countryStamp = [];
  learningStamps = [];
  levelStamps = [];
  star = faStar;
  visitedCountries = [];
  isLoad = false;
  ngOnInit(): void {
    this.getPassportDetails();
  }
  getPassportDetails(): void {
    this.studentService.getPassportDetails().subscribe(
      (response) => {
        let mappedLearnings = [];
        let mappedLevels = [];
        if (response && response.data) {
          this.countryStamp = _.map(response.data.countryStamps, item => {
            let country = {
              title: item.stampTitle,
              isEarned: item.isEarned,
              image: item.images ? item.images[0].image : './assets/images/vietnam.png'
            }
            return country;
          });
          mappedLearnings = _.map(response.data.learningStamps, item => {
            let obj = {
              info: item.stampTitle,
              isEarned: item.isEarned,
              image: item.images ? item.images[0].image : './assets/images/nsima-bent.png'
            }
            return obj;
          });
          mappedLevels = response.data.levelStamps;
          this.learningStamps = mappedLearnings.filter(st => (st.isEarned === 1));
          this.levelStamps = mappedLevels.filter(ob => (ob.isEarned === 1));
          this.visitedCountries = this.countryStamp.filter(ob => (ob.isEarned === 1));
          this.isLoad = true;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * go to Locker Room
   */
  goToLockerRoom(): void {
    if (this.router && this.router.url === '/student/student-landing' || this.router.url === '/student/profile-info') {
      this.router.navigate(['/student/locker-room']);
    } else {
      this.router.navigate(['/student/locker-room'])
        .then(() => {
          window.location.reload();
        });
    }
  }
}