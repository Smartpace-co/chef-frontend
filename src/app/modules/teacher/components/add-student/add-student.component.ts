import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentsService } from '@modules/teacher/services/students.service';
import { environment } from '@environments/environment';
import { ToasterService } from '@appcore/services/toaster.service';
import { faPlus, faCalendarAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { UtilityService } from '@appcore/services/utility.service';
import * as _ from 'lodash';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ClassesService } from '@modules/teacher/services/classes.service';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from '@appcore/services/translation.service';
import { DistrictService } from '@modules/district/services/district.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  studId: string;
  classlabel = "Create"
  PlusIcon = faPlus;
  timesIcon = faTimes;
  Calendar = faCalendarAlt;
  allergens = [];
  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private calendar: NgbCalendar,
    private utilityService: UtilityService,
    private utiltiService: UtilityService,
    private studentService: StudentsService,
    private classService: ClassesService,
    private toast: ToasterService,
    private districtService:DistrictService,
    private ngbConfig: NgbDatepickerConfig,
    private config: NgbDatepickerConfig,
    private translate: TranslationService,
  ) {
    this.studId = this.actRoute.snapshot.params.id;
    if (this.studId) {
      this.classlabel = "Edit"
    }
    const current = new Date();
    config.maxDate = {
      year: current.getFullYear(), month:
        current.getMonth() + 1, day: current.getDate()
    };
    config.outsideDays = 'hidden';
    let today = calendar.getToday();
    this.dateField = new NgbDate(today.year, today.month, today.day)
  }


  DistrictTitle = 'Select District';
  DistrictIcon = '';

  DistrictList = [];
  districtReadOnly = true;

  SchoolTitle = 'Select School';
  SchoolIcon = '';
  SchoolList = [];

  ClassTitle = 'Select Class';
  ClassIcon = '';
  classList = [];
  selectedValue = [];
  selectedClass = null;

  selectedDate: any;
  dateField: NgbDate | null;

  GenderTitle = 'Select Gender';
  GenderIcon = '';
  GenderList = [];

  EthnicityTitle = 'Select Ethnicity';
  EthnicityIcon = '';
  EthnicityList = [];

  GradeTitle = 'Select Grade';
  GradeIcon = '';
  GradeList = [];

  GuardianTitle = 'Select Guardian';
  GuardianIcon = '';
  // GuardianList = [];

  ConditionTitle = 'Select Condition';
  ConditionIcon = '';
  ConditionList = [];


  AllergenTitle = 'Select Allergens';
  AllergenIcon = '';
  AllergenList = [];
  selectedAllergenValue = [];
  selectedAllergen = null;

  RelationshipTitle = 'Select Relationship';
  RelationshipIcon = '';
  RelationshipList = [];

  selectedConditionValue = [];
  selectedCondition = null;

  studentRole: any;

  AddStudent: FormGroup;
  public assetPath = environment.assetUrl;
  localData: any;
  studentId: number;
  apiCount = 0;
  currentStudent;

  ngOnInit(): void {
    this.localData = JSON.parse(window.sessionStorage.getItem('currentUser'));

    this.AddStudent = new FormGroup({
      lastName: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      dob: new FormControl('', [Validators.required]),
      roleId: new FormControl('', [Validators.required]),
      // email: new FormControl(''),
      userName: new FormControl('', [Validators.required, this.validateUserName.bind(this)]),
      contactPersonName: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      contactPersonEmail: new FormControl('', [Validators.email, Validators.required, Validators.pattern(CustomRegex.emailPattern)]),
      contactPersonNumber: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.phoneNumberPattern)]),
      allergenIds: new FormControl([]),
      status: new FormControl(true, [Validators.required]),
      districtId: new FormControl(),
      customDistrictName: new FormControl(''),
      schoolId: new FormControl(''),
      customSchoolName: new FormControl(''),
      classIds: new FormControl(''),
      gender: new FormControl(''),
      ethnicityId: new FormControl(''),
      gradeId: new FormControl('', [Validators.required]),
      // contactType: new FormControl('', [Validators.required]),
      contactPersonRelationId: new FormControl('', [Validators.required]),
      medicalConditionIds: new FormControl(''),
      parentId: new FormControl(this.localData.parentId ? this.localData.parentId : this.localData.id),
    });

    this.getDistrictList();
    if (!this.localData.parentId) this.getClassList();
    this.getGradesList();
    this.getRelationshipList();
    this.getEthnicityList();
    this.getAllergensList();
    this.getMedicalConditionList();
    this.getAllRoles();

    if (this.classlabel == "Edit") {
      this.getStudentInfoById(this.studId);
    }

    // this.GuardianList = [
    //   {
    //     id: 'parent',
    //     menu: this.translate.getStringFromKey('student.profile.parent-menu'),
    //     link: '',
    //   },
    //   {
    //     id: 'guardian',
    //     menu: this.translate.getStringFromKey('student.profile.guardian-menu'),
    //     link: ''
    //   }
    // ];

    this.GenderList = [
      {
        id: '1',
        menu: this.translate.getStringFromKey('district.district-profile.agent-component.gender-field.male-label'),
        link: ''
      },
      {
        id: '2',
        menu: this.translate.getStringFromKey('district.district-profile.agent-component.gender-field.female-label'),
        link: ''
      }
    ]
  }

  /**
* To check valid phone number length
*   
*/
  // validPhoneNumberLength(control: AbstractControl): any {
  //   let isValid = control.value.match(CustomRegex.phoneNumberPattern);
  //   if (control && control.value) {
  //     if (isValid && (control.value.length < 10 || control.value.length === 11 || control.value.length > 13)) {
  //       return { 'contactDigitValidate': true }
  //     }
  //   }
  // }

  getStudentInfoById(id) {
    this.studentService.getStudentById(id).subscribe((studData: any) => {
      this.currentStudent = studData.data;
      studData = studData.data;

      if (studData.districtId && this.localData.parentId) {
        this.AddStudent.get('districtId').setValue(studData.districtId);
        this.DistrictTitle = studData.districtId ? this.DistrictList.filter(obj => obj.id == studData.districtId)[0].menu : this.DistrictTitle;
      } else {
        this.AddStudent.get('customDistrictName').setValue(studData.customDistrictName ? studData.customDistrictName : '');
      }

      if (studData.school && this.localData.parentId) {
        this.AddStudent.get('schoolId').setValue(studData.school.id);
        this.SchoolTitle = studData.school.name
      } else {
        this.AddStudent.get('customSchoolName').setValue(studData.customSchoolName ? studData.customSchoolName : '');
      }

      this.AddStudent.get('classIds').setValue(studData.classes.map(obj => obj.id));
      this.selectedClass = _.map(studData.classes, item => {
        let obj = {
          item_id: item.id,
          item_text: item.title
        }
        return obj;
      });
      this.selectedValue = this.selectedClass;
      // this.classList = this.selectedClass;

      // this.ClassTitle = studData.class;
      this.AddStudent.get('firstName').setValue(studData.firstName);
      this.AddStudent.get('lastName').setValue(studData.lastName);
      this.AddStudent.get('dob').setValue(studData.dob);

      this.AddStudent.get('dob').setValue(this.utilityService.formatDate(studData.dob));
      this.selectedDate = this.utilityService.formatDate(studData.dob);

      this.AddStudent.get('gender').setValue(studData.gender);
      if (studData.gender) {
        this.GenderTitle = studData.gender;
        this.GenderTitle = studData.gender.charAt(0).toUpperCase() + studData.gender.slice(1);
      }

      if (studData.ethnicity) {
        this.AddStudent.get('ethnicityId').setValue(studData.ethnicity.id);
        this.EthnicityTitle = studData.ethnicity.title;
      }

      if (studData.grade) {
        this.AddStudent.get('gradeId').setValue(studData.grade.id);
        this.GradeTitle = studData.grade.grade;
      }

      // this.AddStudent.get('email').setValue(studData.email);
      // if (studData.contactType) {
      //   this.AddStudent.get('contactType').setValue(studData.contactType);
      //   this.GuardianTitle = studData.contactType;
      // }

      this.AddStudent.get('userName').setValue(studData.userName);
      this.AddStudent.get('contactPersonName').setValue(studData.contactPersonName);
      if (studData.relation) {
        this.AddStudent.get('contactPersonRelationId').setValue(studData.relation.id);
        this.RelationshipTitle = studData.relation.title;
      }

      this.AddStudent.get('contactPersonEmail').setValue(studData.contactPersonEmail);
      this.AddStudent.get('contactPersonNumber').setValue(studData.contactPersonNumber);
      this.AddStudent.get('allergenIds').setValue(studData.allergens.map(obj => obj.id));
      this.selectedAllergen = _.map(studData.allergens, item => {
        let obj = {
          item_id: item.id,
          item_text: item.allergenTitle
        }
        return obj;
      });
      this.selectedAllergenValue = this.selectedAllergen;

      this.AddStudent.get('medicalConditionIds').setValue(studData.medicalConditions.map(obj => obj.id));
      this.selectedCondition = _.map(studData.medicalConditions, item => {
        let obj = {
          item_id: item.id,
          item_text: item.title
        }
        return obj;
      });
      this.selectedConditionValue = this.selectedCondition;
      // this.ConditionTitle = this.ConditionList.filter(obj => obj.id == studData.medicalConditions)[0].menu;
      this.AddStudent.get('status').setValue(studData.status);
    });
  }

  get formControl() {
    return this.AddStudent.controls;
  }

  // validatePhoneNumberDigit(control: AbstractControl): any {
  //   if (control && control.value) {
  //     if (control.value.length === 11 || control.value.length > 13) {
  //       return { 'digitValidate': true }
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
    if (uName.match(CustomRegex.emailPattern)) {
      return { 'invalidUserName': true }
    }
    if (uName && uName) {
      if (this.classlabel == "Edit" && this.currentStudent && this.currentStudent.userName === control.value) {
        uName = undefined;
      }
      if (uName) {
        this.districtService.studentUserNameValidator(control.value).subscribe(
          (data) => {
          },
          (error) => {
            console.log(error);
            this.AddStudent.controls['userName'].setErrors({ 'userNameValidate': true });
          }
        );
      }
    }
  }
}
  getDistrictList() {
    this.studentService.getDistrictList().subscribe((response: any) => {
      if (response && response.data) {
        this.DistrictList = _.map(response.data, item => {
          let obj = {
            id: item.id,
            menu: item.name,
            link: ''
          }
          return obj;
        });

        if (this.localData.parentId) {
          this.DistrictList = this.DistrictList.filter(obj => obj.id == this.localData.district_id);
          this.DistrictTitle = this.localData.district_id ? this.DistrictList.filter(obj => obj.id == this.localData.district_id)[0].menu : this.DistrictTitle;
          this.AddStudent.get('districtId').setValue(this.localData.district_id);
          this.getSchoolList(this.localData.district_id, this.localData.school_id);

        }

      }
    }, (error) => {
      this.toast.showToast(error.error.message, '', 'error');
    });
  }

  getSchoolList(districtId, schoolId) {
    this.studentService.getSchoolList(districtId, schoolId).subscribe((response: any) => {
      if (response && response.data) {
        this.SchoolList = _.map(response.data, item => {
          let obj = {
            id: item.id,
            menu: item.name,
            link: ''
          }
          return obj;
        });

        if (this.localData.parentId) {
          this.SchoolList = this.SchoolList.filter(obj => obj.id == this.localData.school_id);
          this.SchoolTitle = this.localData.school_id ? this.SchoolList.filter(obj => obj.id == this.localData.school_id)[0].menu : this.SchoolTitle;
          this.AddStudent.get('schoolId').setValue(this.localData.school_id);
          this.getClassListBySchool(this.localData.school_id);
        }
      }
    }, (error) => {
      this.toast.showToast(error.error.message, '', 'error');
    });
  }

  getClassListBySchool(schoolId): void {
    this.studentService.getClassBySchoolList(schoolId).subscribe(
      (response: any) => {
        if (response && response.data && response.data) {
          this.classList = _.map(response.data, item => {
            let obj = {
              item_id: item.id,
              item_text: item.title
            }
            return obj;
          });
        }
      },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }


  getClassList(): void {
    this.studentService.getClassList().subscribe(
      (response: any) => {

        if (response && response.data && response.data.rows) {
          this.classList = _.map(response.data.rows, item => {
            let obj = {
              item_id: item.id,
              item_text: item.title
            }
            return obj;
          });
        }
      },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getGradesList(): void {
    this.studentService.getGradesList().subscribe((response: any) => {

      if (response && response.data) {
        this.GradeList = _.map(response.data, item => {
          let obj = {
            id: item.id,
            menu: item.grade,
            link: ''
          }
          return obj;
        });
      }
    }, (error) => {
      this.toast.showToast(error.error.message, '', 'error');
    });
  }

  getRelationshipList(): void {
    this.studentService.getRelationshipList().subscribe((response: any) => {

      if (response && response.data) {
        this.RelationshipList = _.map(response.data, item => {
          let obj = {
            id: item.id,
            menu: item.title
          }
          return obj;
        });
      }
    }, (error) => {
      this.toast.showToast(error.error.message, '', 'error');
    });
  }

  getAllergensList(): void {
    this.studentService.getAllergensList().subscribe((response: any) => {

      if (response && response.data) {
        this.AllergenList = _.map(response.data, item => {
          let obj = {
            item_id: item.id,
            item_text: item.allergenTitle
          }
          return obj;
        });
      }
    }, (error) => {
      this.toast.showToast(error.error.message, '', 'error');
    });
  }

  getMedicalConditionList(): void {
    this.studentService.getMedicalConditionList().subscribe((response: any) => {

      if (response && response.data) {
        this.ConditionList = _.map(response.data, item => {
          let obj = {
            item_id: item.id,
            item_text: item.title
          }
          return obj;
        });
      }
    }, (error) => {
      this.toast.showToast(error.error.message, '', 'error');
    });
  }

  getEthnicityList(): void {
    this.studentService.getEthnicityList().subscribe((response: any) => {
      if (response && response.data) {
        this.EthnicityList = _.map(response.data, item => {
          let obj = {
            id: item.id,
            menu: item.title,
            link: ''
          }
          return obj;
        });
      }
    }, (error) => {
      this.toast.showToast(error.error.message, '', 'error');
    });
  }

  getAllRoles(): void {
    this.studentService.getAllMasterRoleDetails().subscribe(
      (response: any) => {
        if (response && response.data) {
          this.studentRole = response.data.find(o => o.title.toLowerCase() === 'student');
          this.AddStudent.get('roleId').setValue(this.studentRole.id);
        }
      },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }


  addstudents() {

    // this.AddStudent.get('roleId').setValue(this.studentRole.id);
    if (this.AddStudent.invalid) {
      this.toast.showToast('Please fill all required fields', '', 'error');
    } else {


      let omitArray = []
      let arr = [];
      if (!this.AddStudent.value.districtId) omitArray.push('districtId');
      if (!this.AddStudent.value.customDistrictName) omitArray.push('customDistrictName');

      if (!this.AddStudent.value.schoolId) omitArray.push('schoolId');
      if (!this.AddStudent.value.customSchoolName) omitArray.push('customSchoolName');

      if (!this.AddStudent.value.classIds) omitArray.push('classIds');

      if (!this.AddStudent.value.contactPersonNumber) omitArray.push('contactPersonNumber');
      if (!this.AddStudent.value.gender) omitArray.push('gender');
      if (!this.AddStudent.value.ethnicityId) omitArray.push('ethnicityId');
      if (!this.AddStudent.value.medicalConditionIds) omitArray.push('medicalConditionIds');
      // this.AddStudent.value.allergens = this.allergens && this.allergens.length > 0 ? this.allergens.join(',') : undefined;

      if (this.selectedValue) {
        _.forEach(this.selectedValue, cls => {
          arr.push(cls.item_id);
        });
      }
      if (this.classlabel == "Create") {
        this.studentService.checkUserNameConflict({ name: this.AddStudent.value.userName }).subscribe(
          (data: any) => {
            if (data && data.status == 200) {
              const submission = _.omit(this.AddStudent.value, omitArray);
              submission['classIds']= arr;
              this.studentService.addStudent(submission).subscribe(
                (data) => {
                  if (data) {
                    if (this.classlabel == "Create") {
                      this.toast.showToast('Student added Successful', '', 'success');
                    } else if (this.classlabel == "Edit") {
                      this.toast.showToast('Student Updated Successful', '', 'success');
                    }
                    this.router.navigate(['teacher/roster-group-tabs']);
                  }
                },
                (error) => {
                  console.log(error);
                  this.toast.showToast(error.error.message, '', 'error');
                }
              );
            }
          },
          (error) => {
            this.toast.showToast(error.error.message, '', 'error');
          }
        );
      } else {
        omitArray.push('roleId');
        const submission = _.omit(this.AddStudent.value, omitArray);

        this.studentService.editStudentDetails(this.studId, submission).subscribe(
          (data) => {
            if (data) {
              this.toast.showToast('Student updated successful', '', 'success');
            }
            this.router.navigate(['teacher/roster-group-tabs']);
          },
          (error) => {
            this.toast.showToast(error.error.message, '', 'error');
          }
        );
      }
    }
  }

  addAllergy() {
    if (this.AddStudent.controls['allergens'].value != "") {
      this.allergens.push(this.AddStudent.controls['allergens'].value);
      this.AddStudent.value.allergens = this.allergens;
    }
  }

  removeAllergy(index) {

    this.allergens.splice(index, 1);
    this.AddStudent.value.allergens = this.allergens;
  }

  districtChange(event) {
    this.DistrictTitle = event.menu;
    this.AddStudent.get('districtId').setValue(event.id);
    this.getSchoolList(event.id, null);
  }

  schoolChange(event) {
    this.SchoolTitle = event.menu;
    this.AddStudent.get('schoolId').setValue(event.id);
    this.getClassListBySchool(event.id);
    // this.getClassList();
  }
  onSelectClass(item) {
    this.selectedValue.push(item);
    this.selectedClass = this.selectedValue;
    this.AddStudent.get('classIds').setValue(this.selectedClass);
  }

  onDeSelectClass(index) {
    this.selectedValue = [];
    // this.selectedClass.splice(index, 1);
    this.selectedClass = this.selectedClass.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedValue = this.selectedClass;
    this.AddStudent.get('classIds').setValue(this.selectedClass);
  }

  onSelectAllClass(item) {
    this.selectedValue = [];
    this.selectedValue = item;
    this.selectedClass = this.selectedValue;
    this.AddStudent.get('classIds').setValue(this.selectedClass);
  }

  onDeselectAllClass(item) {
    this.selectedValue = item;
    this.AddStudent.get('classIds').setValue(this.selectedValue);
  }

  // classChange(event) {
  //   this.ClassTitle = event.menu;
  //   this.AddStudent.get('class').setValue(event.id);
  // }

  onDateSelection(date: NgbDate): void {
    this.AddStudent.get('dob').setValue(this.utilityService.formatDate(date.year + '-' + date.month + '-' + date.day));
  }

  genderChange(event) {
    this.GenderTitle = event.menu;
    this.AddStudent.get('gender').setValue(event.menu);
  }
  ethnicityChange(event) {
    this.EthnicityTitle = event.menu;
    this.AddStudent.get('ethnicityId').setValue(event.id);
  }

  gradeChange(event) {
    this.GradeTitle = event.menu;
    this.AddStudent.get('gradeId').setValue(event.id);
  }

  // guardianChange(event) {
  //   this.GuardianTitle = event.menu;
  //   this.AddStudent.get('contactType').setValue(event.id);
  // }

  relationshipChange(event) {
    this.RelationshipTitle = event.menu;
    this.AddStudent.get('contactPersonRelationId').setValue(event.id);
  }


  onSelectAllergens(item) {

    this.selectedAllergenValue.push(item);
    this.selectedAllergen = this.selectedAllergenValue;

    this.AddStudent.get('allergenIds').setValue(this.selectedAllergen.map(obj => obj.item_id));
  }

  onDeSelectAllergens(index) {
    this.selectedAllergen.splice(index, 1);
    this.selectedAllergenValue = this.selectedAllergen;
    this.AddStudent.get('allergenIds').setValue(this.selectedAllergen.map(obj => obj.item_id));
  }

  onSelectAllAllergens(item) {
    this.selectedAllergenValue = [];
    this.selectedAllergenValue = item;
    this.selectedAllergen = this.selectedAllergenValue;

    // assign selected standards id to array
    this.AddStudent.get('allergenIds').setValue(this.selectedAllergen.map(obj => obj.item_id));
  }

  onDeselectAllAllergens(item) {
    this.selectedValue = item;
    this.AddStudent.get('allergenIds').setValue('');
  }



  onSelectConditions(item) {
    this.selectedConditionValue.push(item);
    this.selectedCondition = this.selectedConditionValue;
    this.AddStudent.get('medicalConditionIds').setValue(this.selectedCondition.map(obj => obj.item_id));

  }

  onDeSelectConditions(index) {
    this.selectedConditionValue = [];
    this.selectedCondition.splice(index, 1);
    this.AddStudent.get('medicalConditionIds').setValue(this.selectedCondition.map(obj => obj.item_id));
  }
  onSelectAllConditions(item) {
    this.selectedConditionValue = [];
    this.selectedConditionValue = item;
    this.selectedCondition = this.selectedConditionValue;
    this.AddStudent.get('medicalConditionIds').setValue(this.selectedCondition.map(obj => obj.item_id));
  }
  onDeselectAllConditions(item) {
    this.selectedConditionValue = item;
    this.AddStudent.get('medicalConditionIds').setValue('');
  }

  // medConditionChange(event) {
  //   this.ConditionTitle = event.menu;

  //   if (this.AddStudent.controls['medicalConditionIds'].value != "") {
  //     this.AddStudent.get('medicalConditionIds').setValue(this.medicalCondition.push(event.id));

  //   }
  // }

  formatNumber(data) {
    this.AddStudent.get('contactPersonNumber').setValue(this.utiltiService.formatPhoneNumber(data));
  }
}
