import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { ToasterService } from '@appcore/services/toaster.service';
import { faPlus, faTimes, faChevronRight, faAngleLeft, faPencilAlt, faCalendarAlt, faStar, } from '@fortawesome/free-solid-svg-icons';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { UtilityService } from '@appcore/services/utility.service';
import { NgbCalendar, NgbDate, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '@modules/student/services/student.service';
import * as _ from 'lodash';
import { PassportComponent } from '../passport/passport.component';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {
  RightArrow = faChevronRight;
  LeftArrow = faAngleLeft;
  Pencil = faPencilAlt;
  star = faStar;
  studId: number;
  PlusIcon = faPlus;
  timesIcon = faTimes;
  closeResult = '';
  classInfo;
  profileImg;
  selectedConditionValue = [];
  selectedCondition = null;
  selectedAllergensValue = [];
  allergens = null;
  allergensList = [];
  visitedCountries = [];
  achievements;
  isDetailsEditable = false;
  constructor(private config: NgbDatepickerConfig, private router: Router, private calendar: NgbCalendar, private utilityService: UtilityService,
    private studentService: StudentService, private toast: ToasterService, private modalService: NgbModal) {
    let today = calendar.getToday()
    this.dateField = new NgbDate(today.year, today.month, today.day)
    const current = new Date();
    config.maxDate = {
      year: current.getFullYear(), month:
        current.getMonth() + 1, day: current.getDate()
    };
    config.outsideDays = 'hidden';
  }

  genderTitle = 'Select Gender';
  genderIcon = '';
  genderList = [
    {
      id: '1',
      menu: 'Male'
    },
    {
      id: '2',
      menu: 'Female'
    }
  ];

  ethnicityTitle = 'Select Ethnicity';
  ethnicityIcon = '';
  ethnicityList = [];

  gradeTitle = 'Select Grade';
  gradeIcon = '';
  gradeList = [];
  conditionTitle = 'Select Condition Type';
  conditionIcon = '';
  conditionList = [];
  sessionData;
  currentStudent;
  dob: NgbDateStruct;
  Calendar = faCalendarAlt;
  districtRole: any;
  selectedDate: any;
  dateField: NgbDate | null;
  ProfileInfo: FormGroup;
  public assetPath = environment.assetUrl;

  ngOnInit(): void {
    this.sessionData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.studId = parseInt(this.sessionData.id);
    this.getAllGradeList();
    this.getEthnicities();
    this.getStudentMedicalConditionsList();
    this.getStudentAllergensList();
    this.getStudentInfoById();
    this.getCurrentLevelDetails();
    this.ProfileInfo = new FormGroup({
      lastName: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      allergens: new FormControl('', []),
      gender: new FormControl('', []),
      ethnicity: new FormControl('', []),
      grade: new FormControl('', []),
      dob: new FormControl(this.dob, [Validators.required]),
      medicalCondition: new FormControl('', [])
    });
  }

  getAllGradeList(): void {
    this.studentService.getGradeList().subscribe(
      (response) => {
        if (response && response.data) {
          this.gradeList = _.map(response.data, item => {
            let obj = {
              id: item.id,
              menu: item.grade
            }
            return obj;
          });
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  getEthnicities(): void {
    this.studentService.getStudentEthnicityList().subscribe(
      (response) => {
        if (response && response.data) {
          this.ethnicityList = _.map(response.data, ele => {
            let obj = {
              id: ele.id,
              menu: ele.title
            }
            return obj;
          });
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  getStudentMedicalConditionsList(): void {
    this.studentService.getStudentMedicalConditionsList().subscribe(
      (response) => {
        if (response && response.data) {
          this.conditionList = _.map(response.data, item => {
            let obj = {
              item_id: item.id,
              item_text: item.title
            }
            return obj;
          });
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getStudentAllergensList(): void {
    this.studentService.getAllergensList().subscribe(
      (response) => {
        if (response && response.data) {
          this.allergensList = _.map(response.data, item => {
            let obj = {
              item_id: item.id,
              item_text: item.allergenTitle
            }
            return obj;
          });
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getStudentInfoById() {
    this.studentService.getStudentById(this.studId).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentStudent = response.data;
          this.currentStudent.age = this.calculateStudentsAge(this.currentStudent.dob);
          this.profileImg = this.currentStudent.profileImage ? this.currentStudent.profileImage : './assets/images/select-1.png';
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  editForm(): void {
    this.isDetailsEditable = true;
    this.ProfileInfo.get('firstName').setValue(this.currentStudent.firstName);
    this.ProfileInfo.get('lastName').setValue(this.currentStudent.lastName);
    this.ProfileInfo.get('gender').setValue(this.currentStudent.gender);
    if (this.currentStudent && this.currentStudent.gender) {
      this.genderTitle = this.currentStudent.gender;
    }
    if (this.currentStudent && this.currentStudent.ethnicity) {
      this.ProfileInfo.get('ethnicity').setValue(this.currentStudent.ethnicity);
      this.ethnicityTitle = this.currentStudent.ethnicity.title;
    }
    if (this.currentStudent && this.currentStudent.grade) {
      this.ProfileInfo.get('grade').setValue(this.currentStudent.grade);
      this.gradeTitle = this.currentStudent.grade.grade;
    }
    this.ProfileInfo.get('dob').setValue(this.utilityService.formatDate(this.currentStudent.dob));
    this.selectedDate = this.utilityService.formatDate(this.currentStudent.dob);
    if (this.currentStudent.allergens) {
      this.ProfileInfo.get('allergens').setValue(this.currentStudent.allergens);
      this.allergens = _.map(this.currentStudent.allergens, item => {
        let obj = {
          item_id: item.id,
          item_text: item.allergenTitle
        }
        return obj;
      });
      this.selectedAllergensValue = this.allergens;

    }
    if (this.currentStudent.medicalConditions) {
      this.ProfileInfo.get('medicalCondition').setValue(this.currentStudent.medicalConditions);
      this.selectedCondition = _.map(this.currentStudent.medicalConditions, item => {
        let obj = {
          item_id: item.id,
          item_text: item.title
        }
        return obj;
      });
      this.selectedConditionValue = this.selectedCondition;
    }
  }

  calculateStudentsAge(dob) {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  get formControl() {
    return this.ProfileInfo.controls;
  }

  genderChange(event) {
    this.genderTitle = event.menu;
    this.ProfileInfo.get('gender').setValue(event);
  }
  ethnicityChange(event) {
    this.ethnicityTitle = event.menu;
    this.ProfileInfo.get('ethnicity').setValue(event);
  }

  gradeChange(event) {
    this.gradeTitle = event.menu;
    this.ProfileInfo.get('grade').setValue(event);
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getDismissReason(reason: any) {
    throw new Error('Method not implemented.');
  }
  onSelectConditions(item) {
    this.selectedConditionValue.push(item);
    this.selectedCondition = this.selectedConditionValue;
    this.ProfileInfo.get('medicalCondition').setValue(this.selectedCondition);
  }

  onDeSelectConditions(index) {
    this.selectedConditionValue = [];
    // this.selectedCondition.splice(index, 1);
    this.selectedCondition = this.selectedCondition.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedConditionValue = this.selectedCondition;
    this.ProfileInfo.get('medicalCondition').setValue(this.selectedCondition);
  }
  onSelectAllConditions(item) {
    this.selectedConditionValue = [];
    this.selectedConditionValue = item;
    this.selectedCondition = this.selectedConditionValue;
    this.ProfileInfo.get('medicalCondition').setValue(this.selectedCondition);
  }
  onDeselectAllConditions(item) {
    this.selectedConditionValue = item;
    this.ProfileInfo.get('medicalCondition').setValue(this.selectedConditionValue);
  }
  onDateSelection(date: NgbDate): void {
    this.ProfileInfo.controls.dob.setValue(date);
  }

  onSelectAllergens(item) {
    this.selectedAllergensValue.push(item);
    this.selectedCondition = this.selectedAllergensValue;
    this.ProfileInfo.get('allergens').setValue(this.selectedCondition);
  }

  onDeSelectAllergens(index) {
    this.selectedAllergensValue = [];
    this.allergens = this.allergens.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedAllergensValue = this.allergens;
    this.ProfileInfo.get('allergens').setValue(this.allergens);
  }
  onSelectAllAllergens(item) {
    this.selectedAllergensValue = [];
    this.selectedAllergensValue = item;
    this.allergens = this.selectedAllergensValue;
    this.ProfileInfo.get('allergens').setValue(this.allergens);
  }
  onDeselectAllAllergens(item) {
    this.selectedAllergensValue = item;
    this.ProfileInfo.get('allergens').setValue(this.selectedAllergensValue);
  }

  /**
   * onEditStudentProfile
   */
  editStudentProfile() {
    if (this.ProfileInfo.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      let temp = [];
      let tempAllergens = [];
      let submission = this.ProfileInfo.value;
      submission.gender = this.ProfileInfo.value.gender && this.ProfileInfo.value.gender.menu ? this.ProfileInfo.value.gender.menu : undefined;
      submission.ethnicityId = this.ProfileInfo.value.ethnicity && this.ProfileInfo.value.ethnicity.id ? this.ProfileInfo.value.ethnicity.id : undefined;
      if (this.selectedConditionValue) {
        _.forEach(this.selectedConditionValue, ob => {
          temp.push(ob.item_id);
        });
      }
      submission.medicalConditionIds = temp;
      submission.firstName = this.ProfileInfo.value.firstName;
      submission.lastName = this.ProfileInfo.value.lastName;
      submission.dob = this.selectedDate;
      submission.gradeId = this.ProfileInfo.value.grade ? this.ProfileInfo.value.grade.id : undefined;
      if (this.selectedAllergensValue) {
        _.forEach(this.selectedAllergensValue, ob => {
          tempAllergens.push(ob.item_id);
        });
      }
      submission.allergenIds = tempAllergens;
      let finalSubmission = _.omit(submission, ['grade', 'ethnicity', 'medicalCondition', 'allergens']);
      this.studentService.editStudentDetails(this.studId, finalSubmission).subscribe(
        (data) => {
          if (data) {
            this.toast.showToast('Student updated successful', '', 'success');
            this.onCancel();
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
  }
  openLockerModal() {
    const modalRef = this.modalService.open(PassportComponent, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'passport-profile' });
    modalRef.componentInstance.name = 'Passport';
  }

  getCurrentLevelDetails(): void {
    this.studentService.getAchievementDetails()
      .subscribe((response) => {
        if (response && response.data) {
          this.achievements = response.data;
        }
      },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
  }

  onCancel(): void {
    this.getStudentInfoById();
    this.isDetailsEditable = false;
    this.genderTitle = 'Select Gender';
    this.ethnicityTitle = 'Select Ethnicity';
    this.gradeTitle = 'Select Grade';
    this.selectedConditionValue = [];
    this.selectedCondition = null;
    this.ProfileInfo.reset();
  }
}