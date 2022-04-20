import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { ToasterService } from '@appcore/services/toaster.service';
import { faPlus, faTimes, faChevronRight, faAngleLeft, faCalendarAlt, } from '@fortawesome/free-solid-svg-icons';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { StudentService } from '@modules/student/services/student.service';
import { NgbCalendar, NgbDate, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { UtilityService } from '@appcore/services/utility.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { DistrictService } from '@modules/district/services/district.service';
@Component({
  selector: 'app-student-sign-up',
  templateUrl: './student-sign-up.component.html',
  styleUrls: ['./student-sign-up.component.scss']
})
export class StudentSignUpComponent implements OnInit {
  RightArrow = faChevronRight;
  LeftArrow = faAngleLeft;
  studId: string;
  PlusIcon = faPlus;
  timesIcon = faTimes;
  queryParamObj: any;
  isParams: boolean = false;
  roleID: number;
  constructor(private config: NgbDatepickerConfig, private router: Router, private districtService: DistrictService, private actRoute: ActivatedRoute,
    private authService: AuthService, private utilityService: UtilityService, private calendar: NgbCalendar, private studentService: StudentService, private toast: ToasterService) {
    let today = calendar.getToday();
    const current = new Date();
    config.maxDate = {
      year: current.getFullYear(), month:
        current.getMonth() + 1, day: current.getDate()
    };
    config.outsideDays = 'hidden';

    this.dateField = new NgbDate(today.year, today.month, today.day)
    if (this.actRoute.snapshot && this.actRoute.snapshot.queryParams) {
      let queryString = Object.keys(this.actRoute.snapshot.queryParams)[0];
      if (queryString) {
        this.queryParamObj = this.authService.queryParamsToJSON(queryString);
        this.isParams = true;
      }
    }
  }
  dob: NgbDateStruct;
  Calendar = faCalendarAlt;
  selectedDate: any;
  dateField: NgbDate | null
  selectedConditionValue = [];
  selectedCondition = null;
  selectedAllergensValue = [];
  selectedAllergen = null;
  // guardianTitle = 'Select Parent/Guardian';
  // guardianIcon = '';
  // guardianList = [
  //   {
  //     id: '1',
  //     menu: 'Parent',
  //     type: 'parent'
  //   },
  //   {
  //     id: '2',
  //     menu: 'Guardian',
  //     type: 'guardian'
  //   }
  // ];
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
  schoolTitle = 'Select School';
  schoolIcon = '';
  // schoolList = [];
  allergensList = [];
  districtTitle = 'Select District';
  districtIcon = '';
  // districtList = []
  ethnicityTitle = 'Select Ethnicity';
  ethnicityIcon = '';
  ethnicityList = [];
  gradeTitle = 'Select Grade';
  gradeIcon = '';
  gradeList = [];
  conditionList = [];
  conditionTitle = 'Select Condition Type';
  relationshipTitle = 'Select Relationship';
  relationshipIcon = '';
  relationshipList = [];
  currentStudent: any;
  token: any;
  signInStudent: FormGroup;
  public assetPath = environment.assetUrl;
  ngOnInit(): void {
    if (this.isParams) {
      this.roleID = parseInt(this.queryParamObj.role_id);
    } else {
      this.roleID = parseInt(localStorage.getItem('rolID'));
    }
    this.getToken();
    this.signInStudent = new FormGroup({
      lastName: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      dob: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required, this.validateUserName.bind(this)]),
      contactPersonName: new FormControl('', [Validators.required]),
      contactPersonEmail: new FormControl('', [Validators.email, Validators.required, Validators.pattern(CustomRegex.emailPattern)]),
      contactPersonNumber: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.phoneNumberPattern)]),
      allergens: new FormControl('', []),
      district: new FormControl(''),
      school: new FormControl('', [Validators.pattern(CustomRegex.namePatteren)]),
      gender: new FormControl('', []),
      ethnicity: new FormControl('', []),
      grade: new FormControl('',[Validators.required]),
      // guardian: new FormControl('', Validators.required),
      relationship: new FormControl('', [Validators.required]),
      medicalCondition: new FormControl('', [])
    });
  }

  getToken(): void {
    this.authService.getGuestUserToken().subscribe(
      (response) => {
        this.token = response.data.guestToken;
        this.getAllGradeList();
        this.getEthnicities();
        // this.getSchoolList();
        // this.getDistricts();
        this.getRelationships();
        this.getStudentMedicalConditionsList();
        this.getStudentAllergensList();
        this.studentService.getFormData().subscribe(ob => this.currentStudent = ob);
        if (this.currentStudent) {
          this.loadFormDetails();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  loadFormDetails(): void {
    if (this.currentStudent) {
      if (this.currentStudent.school && this.currentStudent.school) {
        this.signInStudent.get('school').setValue(this.currentStudent.school);
        // this.schoolTitle = this.currentStudent.school.menu;
      }
      if (this.currentStudent.district && this.currentStudent.district) {
        this.signInStudent.get('district').setValue(this.currentStudent.district);
        // this.districtTitle = this.currentStudent.district.menu;
      }
      this.signInStudent.get('firstName').setValue(this.currentStudent.firstName);
      this.signInStudent.get('lastName').setValue(this.currentStudent.lastName);
      this.signInStudent.get('dob').setValue(this.currentStudent.dob);
      this.selectedDate = this.currentStudent.dob;
      if (this.currentStudent.gender && this.currentStudent.gender.menu) {
        this.signInStudent.get('gender').setValue(this.currentStudent.gender);
        this.genderTitle = this.currentStudent.gender.menu;
      }
      if (this.currentStudent.ethnicity && this.currentStudent.ethnicity.menu) {
        this.signInStudent.get('ethnicity').setValue(this.currentStudent.ethnicity);
        this.ethnicityTitle = this.currentStudent.ethnicity.menu;
      }
      if (this.currentStudent.grade && this.currentStudent.grade.menu) {
        this.signInStudent.get('grade').setValue(this.currentStudent.grade);
        this.gradeTitle = this.currentStudent.grade.menu;
      }
      this.signInStudent.get('contactPersonEmail').setValue(this.currentStudent.contactPersonEmail);
      this.signInStudent.get('userName').setValue(this.currentStudent.userName);
      this.signInStudent.get('contactPersonName').setValue(this.currentStudent.contactPersonName);
      this.signInStudent.get('relationship').setValue(this.currentStudent.relationship);
      this.relationshipTitle = this.currentStudent.relationship.menu;
      // this.signInStudent.get('guardian').setValue(this.currentStudent.guardian);
      // this.guardianTitle = this.currentStudent.guardian.menu;
      this.signInStudent.get('contactPersonNumber').setValue(this.currentStudent.contactPersonNumber);
      if (this.currentStudent.allergens) {
        this.signInStudent.get('allergens').setValue(this.currentStudent.allergens);
        this.selectedAllergen = this.currentStudent.allergens;
        this.selectedAllergensValue = this.selectedAllergen;
      }
      if (this.currentStudent.medicalCondition) {
        this.signInStudent.get('medicalCondition').setValue(this.currentStudent.medicalCondition);
        this.selectedCondition = this.currentStudent.medicalCondition;
        this.selectedConditionValue = this.selectedCondition;
      }
    }
  }

  get formControl() {
    return this.signInStudent.controls;
  }
  // validatePhoneNumber(control: AbstractControl): any {
  //   if (control && control.value) {
  //     if (control.value.length === 11 || control.value.length > 13) {
  //       return { 'contactDigitValidate': true }
  //     }
  //   }
  // }
  /**
* To check valid userName
*  
*/
  validateUserName(control: AbstractControl): any {
    if (control && control.value) {
      let uName = control.value;
      if (uName && this.token) {
        if (uName.match(CustomRegex.emailPattern)) {
          return { 'invalidUserName': true }
        }
        this.studentService.studentUserNameValidator(control.value, this.token).subscribe(
          (data) => {
          },
          (error) => {
            console.log(error);
            this.signInStudent.controls['userName'].setErrors({ 'userNameValidate': true });
          }
        );
      }
    }
  }
  // getSchoolList(districtId?: any): void {
  //   this.studentService.getSchools(1, this.token, districtId).subscribe(
  //     (response) => {
  //       if (response && response.data && response.data.rows) {
  //         this.schoolList = _.map(response.data.rows, item => {
  //           let obj = {
  //             id: item.school.id,
  //             menu: item.school.name
  //           }
  //           return obj;
  //         });
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.toast.showToast(error.error.message, '', 'error');
  //     }
  //   );
  // }

  // getDistricts(): void {
  //   this.studentService.getAllDistrictDetails(this.token).subscribe((response: any) => {
  //     if (response && response.data) {
  //       this.districtList = _.map(response.data, item => {
  //         let obj = {
  //           id: item.id,
  //           menu: item.name
  //         }
  //         return obj;
  //       });
  //     }
  //   }, (error) => {
  //     console.log(error);
  //     this.toast.showToast(error.error.message, '', 'error');
  //   });
  // }
  getAllGradeList(): void {
    this.studentService.getGradeList(this.token).subscribe(
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

  getRelationships(): void {
    this.studentService.getStudentRelationList(this.token).subscribe(
      (response) => {
        if (response && response.data) {
          this.relationshipList = _.map(response.data, ele => {
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
  getEthnicities(): void {
    this.studentService.getStudentEthnicityList(this.token).subscribe(
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
    this.studentService.getStudentMedicalConditionsList(this.token).subscribe(
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
    this.studentService.getAllergensList(this.token).subscribe(
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

  // guardianChange(event) {
  //   this.guardianTitle = event.menu;
  //   this.signInStudent.get('guardian').setValue(event);
  //   if (event && event.type) {
  //     this.relationshipTitle = 'Select Relationship';
  //     this.signInStudent.get('relationship').setValue(null);
  //     this.getRelationships(event.type);
  //   }
  // }

  districtChange(event) {
    // this.districtTitle = event.menu;
    // this.signInStudent.get('district').setValue(event);
    // if (event && event.id) {
    //   this.getSchoolList(event.id);
    // }
  }

  schoolChange(event) {
    // this.schoolTitle = event.menu;
    // this.signInStudent.get('school').setValue(event);
  }
  genderChange(event) {
    this.genderTitle = event.menu;
    this.signInStudent.get('gender').setValue(event);
  }
  ethnicityChange(event) {
    this.ethnicityTitle = event.menu;
    this.signInStudent.get('ethnicity').setValue(event);
  }

  gradeChange(event) {
    this.gradeTitle = event.menu;
    this.signInStudent.get('grade').setValue(event);
  }

  relationshipChange(event) {
    this.relationshipTitle = event.menu;
    this.signInStudent.get('relationship').setValue(event);
  }

  onSelectConditions(item) {
    this.selectedConditionValue.push(item);
    this.selectedCondition = this.selectedConditionValue;
    this.signInStudent.get('medicalCondition').setValue(this.selectedCondition);
  }

  onDeSelectConditions(index) {
    this.selectedConditionValue = [];
    // this.selectedCondition.splice(index, 1);
    this.selectedCondition = this.selectedCondition.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedConditionValue = this.selectedCondition;
    this.signInStudent.get('medicalCondition').setValue(this.selectedCondition);
  }
  onSelectAllConditions(item) {
    this.selectedConditionValue = [];
    this.selectedConditionValue = item;
    this.selectedCondition = this.selectedConditionValue;
    this.signInStudent.get('medicalCondition').setValue(this.selectedCondition);
  }
  onDeselectAllConditions(item) {
    this.selectedConditionValue = item;
    this.signInStudent.get('medicalCondition').setValue(this.selectedConditionValue);
  }

  onSelectAllergens(item) {
    this.selectedAllergensValue.push(item);
    this.selectedAllergen = this.selectedAllergensValue;
    this.signInStudent.get('allergens').setValue(this.selectedAllergen);
  }

  onDeSelectAllergens(index) {
    this.selectedAllergensValue = [];
    this.selectedAllergen = this.selectedAllergen.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedAllergensValue = this.selectedAllergen;
    this.signInStudent.get('allergens').setValue(this.selectedAllergen);
  }
  onSelectAllAllergens(item) {
    this.selectedAllergensValue = [];
    this.selectedAllergensValue = item;
    this.selectedAllergen = this.selectedAllergensValue;
    this.signInStudent.get('allergens').setValue(this.selectedAllergen);
  }
  onDeselectAllAllergens(item) {
    this.selectedAllergensValue = item;
    this.signInStudent.get('allergens').setValue(this.selectedAllergensValue);
  }

  onDateSelection(date: NgbDate): void {
    this.signInStudent.controls.dob.setValue(date);
  }
  onCancel(): void {
    this.router.navigate(['/auth/sign-up']);
  }
  onNext(): void {
    if (this.signInStudent.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      let dataToSave = this.signInStudent.value;
      dataToSave['dob'] = this.selectedDate;
      // dataToSave['allergens'] = this.selectedAllergensValue;
      dataToSave['token'] = this.token;
      dataToSave['isValidForm'] = !this.signInStudent.invalid;
      dataToSave['roleId'] = this.roleID;
      dataToSave['packageId'] = this.queryParamObj && this.queryParamObj.packageId ? parseInt(this.queryParamObj.packageId) : undefined;
      dataToSave['queryParamUrl'] = this.actRoute.snapshot && this.actRoute.snapshot.queryParams ? this.actRoute.snapshot.queryParams : undefined,
        this.studentService.setFormData(dataToSave);
      this.router.navigate(['/auth/student-membership']);
    }
  }
}
