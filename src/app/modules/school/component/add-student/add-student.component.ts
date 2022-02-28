import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { ToasterService } from '@appcore/services/toaster.service';
import { faCalendarAlt, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { UtilityService } from '@appcore/services/utility.service';
import { NgbCalendar, NgbDate, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SchoolService } from '@modules/school/services/school.service';
import * as _ from 'lodash';
import { AuthService } from '@modules/auth/services/auth.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
})
export class AddStudentComponent implements OnInit {
  studId: string;
  classId: string;
  isEdit = false;
  isEditClass = false;
  PlusIcon = faPlus;
  timesIcon = faTimes;
  allergens = [];
  dob: NgbDateStruct;
  Calendar = faCalendarAlt;
  activateUserData: any;
  studentRole: any;
  selectedDate: any;
  schoolDetails: any;
  parent_id: any;


  dateField: NgbDate | null;
  constructor(private config: NgbDatepickerConfig,private router: Router, private authService: AuthService,
    private calendar: NgbCalendar, private schoolService: SchoolService,private location: Location,
    private actRoute: ActivatedRoute, private utilityService: UtilityService, private toast: ToasterService) {
    this.studId = this.actRoute.snapshot.queryParams.id;
    this.classId = this.actRoute.snapshot.queryParams.classId;

    if (this.studId) {
      this.isEdit = true;
    }
    if(this.classId){
      this.isEditClass=true
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
  selectedAllergenValue=[];
  allergensList=[];
  selectedCondition = null;
  selectedAllergen=null;
  ethnicityTitle = 'Select Ethnicity';
  ethnicityIcon = '';
  ethnicityList = [];
  gradeTitle = 'Select Grade';
  gradeIcon = '';
  gradeList = [];
  // guardianTitle = 'Select Guardian';
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
  currentClass: any;


  public assetPath = environment.assetUrl;

  ngOnInit(): void {
    this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
    if(this.activateUserData.parentId!=null)
    {
      this.parent_id=this.activateUserData.parentId

    }
    else
    {
      this.parent_id=this.activateUserData.id

    }

    this.getSchoolList();
    this.getAllGradeList();
    this.getEthnicities();
    this.getRelationships();
    this.getStudentMedicalConditionsList();
    this.getAllAllergensList();
   

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
      grade: new FormControl('', [Validators.required]),
      // guardian: new FormControl('', [Validators.required]),
      relationship: new FormControl('', [Validators.required]),
      medicalCondition: new FormControl('', [])
    });

    if (this.isEdit) {
      this.getStudentInfoById(this.studId);
    } else {
      this.getAllRoles();
    }

    if (this.isEditClass) {
      this.addStudentInfoByClassId(this.classId);
    }
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
    this.schoolService.getSchools(1).subscribe(
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

  /**
   * to get role_id
   */
  getAllRoles(): void {
    this.authService.getAllMasterRoleDetails().subscribe(
      (response) => {
        if (response && response.data) {
          this.studentRole = response.data.find(o => o.title.toLowerCase() === 'student');
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getClassList(): void {
    this.schoolService.getAllClasses(1).subscribe(
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
    this.schoolService.getGradeList().subscribe(
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
    this.schoolService.getStudentById(this.studId).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentStudent = response.data;
          if (this.currentStudent.school && this.currentStudent.school.name) {
            this.AddStudent.get('school').setValue(this.currentStudent.school);
            this.SchoolTitle = this.currentStudent.school.name;
          }
          this.AddStudent.get('class').setValue(this.currentStudent.classes);
          this.selectedClass = _.map(this.currentStudent.classes, item => {
            let obj = {
              item_id: item.id,
              item_text: item.title
            }
            return obj;
          });
          this.selectedValue = this.selectedClass;
          this.AddStudent.get('firstName').setValue(this.currentStudent.firstName);
          this.AddStudent.get('lastName').setValue(this.currentStudent.lastName);
          this.AddStudent.get('dob').setValue(this.currentStudent.dob);
          this.selectedDate = this.currentStudent.dob;
          this.AddStudent.get('gender').setValue(this.currentStudent.gender);
          // this.AddStudent.get('userName').setValue(this.currentStudent.userName);

          if (this.currentStudent && this.currentStudent.gender) {
            this.genderTitle = this.currentStudent.gender;
          }
          if (this.currentStudent && this.currentStudent.ethnicity) {
            this.AddStudent.get('ethnicity').setValue(this.currentStudent.ethnicity);
            this.ethnicityTitle = this.currentStudent.ethnicity.title;
          }
          
          if (this.currentStudent && this.currentStudent.grade) {
            this.AddStudent.get('grade').setValue(this.currentStudent.grade.id);
            this.gradeTitle = this.currentStudent.grade.grade;
          }
          this.AddStudent.get('contactPersonEmail').setValue(this.currentStudent.contactPersonEmail);
          // this.AddStudent.get('guardian').setValue(this.currentStudent.contactType);
          // this.guardianTitle = this.currentStudent.contactType;
          this.AddStudent.get('userName').setValue(this.currentStudent.userName);
          this.AddStudent.get('contactPersonName').setValue(this.currentStudent.contactPersonName);
          this.AddStudent.get('relationship').setValue(this.currentStudent.relation.title);
          this.relationshipTitle = this.currentStudent.relation.title;
          //this.AddStudent.get('contactPersonEmail').setValue(this.currentStudent.email);
          this.AddStudent.get('contactPersonNumber').setValue(this.currentStudent.contactPersonNumber);
        //  this.allergens = this.currentStudent.allergens && this.currentStudent.allergens.split(',');
          this.AddStudent.get('medicalCondition').setValue(this.currentStudent.medicalConditions);
          this.selectedCondition = _.map(this.currentStudent.medicalConditions, item => {
            let obj = {
              item_id: item.id,
              item_text: item.title
            }
            return obj;
          });
          this.selectedConditionValue = this.selectedCondition;
          this.AddStudent.get('allergens').setValue(this.currentStudent.allergens);
          this.selectedAllergen = _.map(this.currentStudent.allergens, item => {
            let obj = {
              item_id: item.id,
              item_text: item.allergenTitle
            }
            return obj;
          });
          this.selectedAllergenValue = this.selectedAllergen;

          this.AddStudent.get('status').setValue(this.currentStudent.status === true ? 'active' : 'inactive');
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );

  }


  addStudentInfoByClassId(classId) {
    this.schoolService.addStudentInfoByClassId(classId).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentClass = response.data;
          let title=this.currentClass.title;
          let id=this.currentClass.id;
          this.classList = [
            {
              item_id:id,
              item_text:title
            }]
          this.AddStudent.get('class').setValue(this.classList);
          this.selectedClass = this.classList;
         this.selectedValue = this.classList;
         this.selectedClass[0] = {...this.selectedClass[0], isDisabled: true};

          if (this.currentClass && this.currentClass.grade) {
        //    this.gradeList=this.currentClass.grade;
            this.AddStudent.get('grade').setValue(this.currentClass.grade.id);
            this.gradeTitle = this.currentClass.grade.grade;
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
          this.schoolService.studentUserNameValidator(control.value).subscribe(
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
    this.schoolService.getStudentRelationList().subscribe(
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
    this.schoolService.getStudentEthnicityList().subscribe(
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
    this.schoolService.getStudentMedicalConditionsList().subscribe(
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

  getAllAllergensList():void{
    this.schoolService.getAllAllergens().subscribe(res=>{
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

  // addAllergy() {
  //   if (this.AddStudent.controls['allergens'].value != "") {
  //     this.allergens.push(this.AddStudent.controls['allergens'].value);
  //     this.AddStudent.value.allergens = this.allergens;
  //   }
  //   this.AddStudent.get('allergens').setValue('');
  // }
  // removeAllergy(index) {
  //   this.allergens.splice(index, 1);
  //   // this.AddStudent.value.allergens = this.allergens;
  // }

  schoolChange(event) {
    this.SchoolTitle = event.menu;
    this.AddStudent.get('school').setValue(event);
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
    this.AddStudent.get('allergens').setValue(this.selectedAllergenValue);
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
      this.router.navigate(['/school/class-details'], { queryParams: { id: this.classId,action:'Students' } });
    } else {
      this.location.back();
      // this.router.navigate(['/school/admin-student']);
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
      let arr = [];
      let temp1 = [];

      let submission = this.AddStudent.value;
      submission.contactPersonNumber = this.AddStudent.value.contactPersonNumber;
      submission.schoolId = this.AddStudent.value.school && this.AddStudent.value.school.id ? this.AddStudent.value.school.id : undefined;
      submission.gender = this.AddStudent.value.gender && this.AddStudent.value.gender.menu ? this.AddStudent.value.gender.menu : undefined;
      submission.ethnicityId = this.AddStudent.value.ethnicity && this.AddStudent.value.ethnicity.id ? this.AddStudent.value.ethnicity.id : undefined;
      // submission.contactType = this.AddStudent.value.guardian.type;
      submission.status = this.AddStudent.value.status === 'active' ? true : false;
      submission.contactPersonRelationId = this.AddStudent.value.relationship && this.AddStudent.value.relationship.id ? this.AddStudent.value.relationship.id : undefined;
      submission.parentId=this.parent_id

      if(this.selectedConditionValue){
        _.forEach(this.selectedConditionValue, ob => {
          temp.push(ob.item_id);
        });
      }
      if(this.selectedValue){
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
      submission.contactPersonEmail = this.AddStudent.value.contactPersonEmail;
      submission.allergenIds = temp1
      let finalSubmission = _.omit(submission, ['relationship', 'school', 'class', 'grade', 'ethnicity', 'medicalCondition','allergens']);
      if (this.isEdit) {
        this.schoolService.editStudentDetails(this.studId, finalSubmission).subscribe(
          (data) => {
            if (data) {
              this.toast.showToast('Student updated successful', '', 'success');
              this.onCancel();
            }
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        this.activateUserData = JSON.parse(window.sessionStorage.getItem('currentUser'));
      //  finalSubmission.roleId = this.activateUserData.role.id;
        this.schoolService.getSchoolDetailsByUserId(this.activateUserData.id).subscribe(
          (response) => {
            if (response && response.data) {
              this.schoolDetails = response.data[0];
              finalSubmission.districtId = this.schoolDetails.district_id;
              finalSubmission.schoolId=this.schoolDetails.id;
              
              
              finalSubmission.roleId=this.studentRole.id;

              this.schoolService.addStudentDetails(finalSubmission).subscribe(
                (data) => {
                  if (data) {
                    this.toast.showToast('Student added successful', '', 'success');
                    this.onCancel();
                  }
                },
                (error) => {
                  console.log(error);
                }
              );
            }
          });
      }
    }
  }
}
