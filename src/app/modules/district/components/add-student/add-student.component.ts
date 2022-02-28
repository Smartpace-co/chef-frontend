import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentsService } from '@modules/teacher/services/students.service';
import { environment } from '@environments/environment';
import { ToasterService } from '@appcore/services/toaster.service';
import { faCalendarAlt, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { UtilityService } from '@appcore/services/utility.service';
import { NgbCalendar, NgbDate, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DistrictService } from '@modules/district/services/district.service';
import * as _ from 'lodash';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
})
export class AddStudentComponent implements OnInit {
  studId: string;
  isEdit = false;
  PlusIcon = faPlus;
  timesIcon = faTimes;
  allergensList = [];
  dob: NgbDateStruct;
  Calendar = faCalendarAlt;
  districtRole: any;
  selectedDate: any;
  dateField: NgbDate | null;
  classId: any;
  schoolId: any;
  selectedAllergen=null;
  activateUserData:any;
  currentUser:any;

  constructor(private config: NgbDatepickerConfig, private router: Router, private authService: AuthService,
    private calendar: NgbCalendar, private districtService: DistrictService,
    private actRoute: ActivatedRoute, private utilityService: UtilityService, private utiltiService: UtilityService, private studentService: StudentsService, private toast: ToasterService) {
    this.studId = this.actRoute.snapshot.queryParams.id;
    this.classId = this.actRoute.snapshot.queryParams.cid;
    this.schoolId = this.actRoute.snapshot.queryParams.sid;
    if (this.studId) {
      this.isEdit = true;
    }
    let today = calendar.getToday()
    this.dateField = new NgbDate(today.year, today.month, today.day)
    const current = new Date();
    config.maxDate = {
      year: current.getFullYear(), month:
        current.getMonth() + 1, day: current.getDate()
    };
    config.outsideDays = 'hidden';
  }
  DistrictTitle = 'Select District';
  DistrictIcon = '';

  DistrictList = [
    {
      id: '1',
      menu: 'District 1',
      link: ''
    },
    {
      id: '2',
      menu: 'District 2',
      link: ''
    },
    {
      id: '3',
      menu: 'District 3',
      link: ''
    }
  ];

  SchoolTitle = 'Select School';
  SchoolIcon = '';
  schoolList = [];
  classList = [];
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
    },
    {
      id: '3',
      menu: 'Other'
    }
  ];
  selectedValue = [];
  selectedClass = null;
  selectedConditionValue = [];
  selectedCondition = null;
  ethnicityTitle = 'Select Ethnicity';
  ethnicityIcon = '';
  ethnicityList = [];
  gradeTitle = 'Select Grade';
  gradeIcon = '';
  gradeList = [];
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
  conditionList = [];
  relationshipTitle = 'Select Relationship';
  relationshipIcon = '';
  relationshipList = [];
  AddStudent: FormGroup;
  currentStudent: any;
  selectedAllergenValue=[];
  packageId:any;

  public assetPath = environment.assetUrl;

  ngOnInit(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    this.currentUser = JSON.parse(window.localStorage.getItem('districtDetails'));

    this.getSchoolList();
    this.getAllGradeList();
    this.getEthnicities();
    this.getStudentMedicalConditionsList();
    this.getRelationships();
    this.getAllAllergensList();
    this.getSubscribePackageDetails()

    if (this.classId) {
      this.getClassDetails();
    }
    if (this.schoolId) {
      this.getSchoolDetails();
    }
    this.AddStudent = new FormGroup({
      lastName: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.namePatteren)]),
      dob: new FormControl(this.dob, [Validators.required]),
      userName: new FormControl('', [Validators.required, this.validateUserName.bind(this)]),
      contactPersonName: new FormControl('', [Validators.required]),
      contactPersonEmail: new FormControl('', [Validators.email, Validators.required, Validators.pattern(CustomRegex.emailPattern)]),
      contactPersonNumber: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.phoneNumberPattern)]),
      status: new FormControl('active', [Validators.required]),
      allergens: new FormControl('',[]),
      school: new FormControl('', []),
      class: new FormControl('', []),
      gender: new FormControl('', []),
      ethnicity: new FormControl('', []),
      grade: new FormControl('',[Validators.required]),
      // guardian: new FormControl('', [Validators.required]),
      relationship: new FormControl('', [Validators.required]),
      medicalCondition: new FormControl('', [])
    });

    if (this.isEdit) {
      this.getStudentInfoById(this.studId);
    }
  }
  getSubscribePackageDetails():void{
    this.districtService.getSubscribePackageDetails(this.activateUserData.subscribeId).subscribe(res=>{
      if(res && res.data[0]){
        this.packageId=res.data[0].packageId
      }
    })
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
  getSchoolList(): void {
    this.districtService.getSchools(1).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.schoolList = _.map(response.data.rows, item => {
            let obj = {
              id: item.school.id,
              menu: item.school.name
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
  getAllAllergensList():void{
    this.districtService.getAllAllergens().subscribe(res=>{
     if(res && res.data){
       this.allergensList=_.map(res.data,item=>{
         let obj={
           item_id:item.id,
           item_text:item.allergenTitle
         }
         return obj;
       })
     }
    })
  }

  getClassList(): void {
    let isExistInSchool = this.AddStudent.value.school.id ? undefined : false;
    this.districtService.getAllClasses(1, undefined, this.AddStudent.value.school.id, isExistInSchool).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          let filterdData = response.data.rows.filter(obj => obj.grade.id === this.AddStudent.value.grade.id)
          this.classList = _.map(filterdData, item => {
            let obj = {
              item_id: item.id,
              item_text: item.title
            }
            return obj;
          });
          this.selectedClass = this.classList;
          this.selectedValue = this.classList;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  getAllGradeList(): void {
    this.districtService.getGradeList().subscribe(
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
  getStudentInfoById(id) {
    this.districtService.getStudentById(this.studId).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentStudent = response.data;
          if (this.currentStudent.school && this.currentStudent.school.name) {
            this.AddStudent.get('school').setValue(this.currentStudent.school);
            this.SchoolTitle = this.currentStudent.school.name;
          }
          if (this.currentStudent.classes) {
            this.AddStudent.get('class').setValue(this.currentStudent.classes);
            this.selectedClass = _.map(this.currentStudent.classes, item => {
              let obj = {
                item_id: item.id,
                item_text: item.title
              }
              return obj;
            });
            this.selectedValue = this.selectedClass;
            this.classList = this.selectedClass;
          }
          this.AddStudent.get('firstName').setValue(this.currentStudent.firstName);
          this.AddStudent.get('lastName').setValue(this.currentStudent.lastName);
          this.AddStudent.get('dob').setValue(this.currentStudent.dob);
          this.selectedDate = this.currentStudent.dob;
          this.AddStudent.get('gender').setValue(this.currentStudent.gender);
          if (this.currentStudent && this.currentStudent.gender) {
            this.genderTitle = this.currentStudent.gender;
            this.genderTitle = this.currentStudent.gender.charAt(0).toUpperCase() + this.currentStudent.gender.slice(1);
          }
          if (this.currentStudent && this.currentStudent.ethnicity) {
            this.AddStudent.get('ethnicity').setValue(this.currentStudent.ethnicity);
            this.ethnicityTitle = this.currentStudent.ethnicity.title;
          }
          if (this.currentStudent && this.currentStudent.grade) {
            this.AddStudent.get('grade').setValue(this.currentStudent.grade);
            this.gradeTitle = this.currentStudent.grade.grade;
          }
          this.AddStudent.get('contactPersonEmail').setValue(this.currentStudent.contactPersonEmail);
          // this.AddStudent.get('guardian').setValue(this.currentStudent.contactType);
          // this.guardianTitle = this.currentStudent.contactType;
          this.AddStudent.get('userName').setValue(this.currentStudent.userName);
          this.AddStudent.get('contactPersonName').setValue(this.currentStudent.contactPersonName);
          this.AddStudent.get('relationship').setValue(this.currentStudent.relation.title);
          this.relationshipTitle = this.currentStudent.relation.title;
          this.AddStudent.get('contactPersonNumber').setValue(this.currentStudent.contactPersonNumber);
          if (this.currentStudent.allergens) {
            this.AddStudent.get('allergens').setValue(this.currentStudent.allergens);
            this.selectedAllergen = _.map(this.currentStudent.allergens, item => {
              let obj = {
                item_id: item.id,
                item_text: item.allergenTitle
              }
              return obj;
            });
            this.selectedAllergenValue = this.selectedAllergen;
          }
          if (this.currentStudent.medicalConditions) {
            this.AddStudent.get('medicalCondition').setValue(this.currentStudent.medicalConditions);
            this.selectedCondition = _.map(this.currentStudent.medicalConditions, item => {
              let obj = {
                item_id: item.id,
                item_text: item.title
              }
              return obj;
            });
            this.selectedConditionValue = this.selectedCondition;
          }
          this.AddStudent.get('status').setValue(this.currentStudent.status === true ? 'active' : 'inactive');
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * To add student from class-info.
   */
  getClassDetails(): void {
    this.districtService.getClassById(this.classId).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentStudent = response.data;
          if (this.currentStudent.school && this.currentStudent.school.name) {
            this.AddStudent.get('school').setValue(this.currentStudent.school);
            this.SchoolTitle = this.currentStudent.school.name;
          }
          this.AddStudent.get('class').setValue(this.currentStudent.id);
          this.selectedClass = [{
            item_id: this.currentStudent.id,
            item_text: this.currentStudent.title
          }];
          this.selectedValue = this.selectedClass;
          this.classList = this.selectedClass;
          if (this.currentStudent && this.currentStudent.grade) {
            this.AddStudent.get('grade').setValue(this.currentStudent.grade);
            this.gradeTitle = this.currentStudent.grade.grade;
          }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * To add student from school-info.
   */
  getSchoolDetails(): void {
    this.districtService.getSchoolById(this.schoolId).subscribe(
      (response) => {
        if (response && response.data && response.data.school) {
          let schoolData = response.data.school;
          this.AddStudent.get('school').setValue(schoolData);
          this.SchoolTitle = schoolData.name;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  /**
 * To check valid userName
 *  
 */
  validateUserName(control: AbstractControl): any {
    if (control && control.value) {
      let uName = control.value;
      if (uName && uName) {
        if (uName.match(CustomRegex.emailPattern)) {
          return { 'invalidUserName': true }
        }
        if (this.isEdit && this.currentStudent && this.currentStudent.userName === control.value) {
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

  getRelationships(): void {
    this.districtService.getStudentRelationList().subscribe(
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
    this.districtService.getStudentEthnicityList().subscribe(
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
    this.districtService.getStudentMedicalConditionsList().subscribe(
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

  schoolChange(event) {
    this.SchoolTitle = event.menu;
    this.AddStudent.get('school').setValue(event);
    if (event && event.id) {
      this.getClassList();
    }
  }
  genderChange(event) {
    this.genderTitle = event.menu;
    this.AddStudent.get('gender').setValue(event);
  }
  ethnicityChange(event) {
    this.ethnicityTitle = event.menu;
    this.AddStudent.get('ethnicity').setValue(event);
  }

  gradeChange(event) {
    this.gradeTitle = event.menu;
    this.AddStudent.get('grade').setValue(event);
    if (event && event.id) {
      this.getClassList();
    }
  }

  // guardianChange(event) {
  //   this.guardianTitle = event.menu;
  //   this.AddStudent.get('guardian').setValue(event);
  //   if (event && event.type) {
  //     this.relationshipTitle = 'Select Relationship';
  //     this.AddStudent.get('relationship').setValue(null);
  //     this.getRelationships(event.type);
  //   }
  // }

  relationshipChange(event) {
    this.relationshipTitle = event.menu;
    this.AddStudent.get('relationship').setValue(event);
  }

  // formatNumber(data) {
  //   this.AddStudent.get('contactPersonNumber').setValue(this.utiltiService.formatPhoneNumber(data));
  // }

  onSelectClass(item) {
    this.selectedValue.push(item);
    this.selectedClass = this.selectedValue;
    this.AddStudent.get('class').setValue(this.selectedClass);
  }

  onDeSelectClass(index) {
    this.selectedValue = [];
    // this.selectedClass.splice(index, 1);
    this.selectedClass = this.selectedClass.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedValue = this.selectedClass;
    this.AddStudent.get('class').setValue(this.selectedClass);
  }
  onSelectAllClass(item) {
    this.selectedValue = [];
    this.selectedValue = item;
    this.selectedClass = this.selectedValue;
    this.AddStudent.get('class').setValue(this.selectedClass);
  }

  onDeselectAllClass(item) {
    this.selectedValue = item;
    this.AddStudent.get('class').setValue(this.selectedValue);
  }
  onSelectConditions(item) {
    this.selectedConditionValue.push(item);
    this.selectedCondition = this.selectedConditionValue;
    this.AddStudent.get('medicalCondition').setValue(this.selectedCondition);
  }
  onSelectAllergens(item) {
    this.selectedAllergenValue.push(item);
    this.selectedAllergen = this.selectedAllergenValue;
    this.AddStudent.get('allergens').setValue(this.selectedAllergen);
  }

  onDeSelectConditions(index) {
    this.selectedConditionValue = [];
    this.selectedCondition = this.selectedCondition.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedConditionValue = this.selectedCondition;
    this.AddStudent.get('medicalCondition').setValue(this.selectedCondition);
  }
  onDeSelectAllergens(index) {
    this.selectedAllergenValue = [];
    this.selectedAllergen = this.selectedAllergen.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedAllergenValue = this.selectedAllergen;
    this.AddStudent.get('allergens').setValue(this.selectedAllergen);
  }
  onSelectAllConditions(item) {
    this.selectedConditionValue = [];
    this.selectedConditionValue = item;
    this.selectedCondition = this.selectedConditionValue;
    this.AddStudent.get('medicalCondition').setValue(this.selectedCondition);
  }
  
  onSelectAllAllergens(item) {
    this.selectedAllergenValue = [];
    this.selectedAllergenValue = item;
    this.selectedAllergen = this.selectedAllergenValue;
    this.AddStudent.get('allergens').setValue(this.selectedAllergen);
  }
  onDeselectAllConditions(item) {
    this.selectedConditionValue = item;
    this.AddStudent.get('medicalCondition').setValue(this.selectedConditionValue);
  }
   onDeselectAllAllergens(item) {
    this.selectedAllergenValue = item;
    this.AddStudent.get('allergens').setValue(this.selectedAllergenValue);

  }

  onDateSelection(date: NgbDate): void {
    this.AddStudent.controls.dob.setValue(date);
  }

  onCancel(): void {
    this.AddStudent.reset();
    if (this.classId) {
      this.router.navigate(['/district/class-details'], { queryParams: { id: this.classId,action:'Students' } });
    } else if (this.schoolId) {
      this.router.navigate(['/district/school-details'], { queryParams: { id: this.schoolId,action:'Students' } });
    } else {
      this.router.navigate(['/district/admin-student']);
    }
  }

  /**
   * onSave
   */
  addstudents() {
    if (this.AddStudent.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      let temp = [];
      let temp1 = [];
      let arr = [];
      let submission = this.AddStudent.value;
      submission.schoolId = this.AddStudent.value.school && this.AddStudent.value.school.id ? this.AddStudent.value.school.id : undefined;
      submission.gender = this.AddStudent.value.gender && this.AddStudent.value.gender.menu ? this.AddStudent.value.gender.menu : undefined;
      submission.ethnicityId = this.AddStudent.value.ethnicity && this.AddStudent.value.ethnicity.id ? this.AddStudent.value.ethnicity.id : undefined;
      // submission.contactType = this.AddStudent.value.guardian.type;
      submission.status = this.AddStudent.value.status === 'active' ? true : false;
      submission.contactPersonRelationId = this.AddStudent.value.relationship && this.AddStudent.value.relationship.id ? this.AddStudent.value.relationship.id : undefined;
      if (this.selectedConditionValue) {
        _.forEach(this.selectedConditionValue, ob => {
          temp.push(ob.item_id);
        });
      }
      if (this.selectedValue) {
        _.forEach(this.selectedValue, cls => {
          arr.push(cls.item_id);
        });
      }
      if(this.selectedAllergenValue){
        _.forEach(this.selectedAllergenValue, al => {
          temp1.push(al.item_id);
        });
      }
      submission.classIds = arr;
      submission.medicalConditionIds = temp;
      submission.dob = this.utilityService.formatDate(this.selectedDate);
      submission.gradeId = this.AddStudent.value.grade.id;
      submission.allergenIds = temp1
      submission.parentId=this.currentUser.user_id
      
      let finalSubmission = _.omit(submission, ['relationship', 'school', 'class', 'grade', 'ethnicity', 'medicalCondition','allergens']);
      if (this.isEdit) {
        this.districtService.editStudentDetails(this.studId, finalSubmission).subscribe(
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
      } else {
        this.districtRole = JSON.parse(localStorage.getItem('districtDetails'));
        finalSubmission.districtId = this.districtRole.id;
        this.districtService.addStudentDetails(finalSubmission).subscribe(
          (data) => {
            if (data) {
              this.toast.showToast('Student added successful', '', 'success');
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
  }
}
