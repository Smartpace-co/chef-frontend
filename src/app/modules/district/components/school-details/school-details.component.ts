import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  faAngleLeft,
  faEdit,
  faList,
  faThLarge,
  faSearch,
  faExclamationTriangle,
  faChevronRight,
  faAngleDoubleRight,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '@appcore/services/toaster.service';
import { DistrictService } from '@modules/district/services/district.service';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomRegex } from '@appcore/validators/custom-regex';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-school-details',
  templateUrl: './school-details.component.html',
  styleUrls: ['./school-details.component.scss']
})
export class SchoolDetailsComponent implements OnInit {
  @ViewChild('profile') ProfileModal: ElementRef;

  LeftArrow = faAngleLeft;
  faEdit = faEdit;
  TileView = faList;
  ViewIcon = faThLarge;
  SearchIcon = faSearch;
  exclamationTriangle = faExclamationTriangle;
  rightArrow = faChevronRight;
  NextArrow = faAngleDoubleRight;
  addIcon = faPlus;
  active = 1;
  gridView = true;
  schoolID: any;
  listView = false;
  ViewTitle = 'Tile View';
  closeResult = '';
  allergenList:string;
  classes: any;
  newStudents=0
  mins=0;
  teacherMins=0
  inactiveStudents:any;
  ViewList = [
    {
      id: '1',
      menu: 'Tile View',
      link: '',
      icon: faThLarge
    },
    {
      id: '2',
      menu: 'List View',
      link: '',
      icon: faList
    }
  ];
  filterListtitle = 'All Students';
  filterList = [
    {
      menu: 'All Students'
    },
    {
      id: '1',
      menu: 'Active'
    },
    {
      id: '0',
      menu: 'Inactive'
    }
  ];
  sortByIdTitle = 'Sort by Student ID';
  sortByList = [
    {
      id: '1',
      menu: 'Sort by student ID:None'
    },
    {
      id: '1',
      menu: 'Ascending',
      value: 'asc'
    },
    {
      id: '2',
      menu: 'Descending',
      value: 'desc'
    }
  ];
  schoolTitle = '';
  schoolIcon = '';
  schoolList = [];
  gradeTitle = 'Select the grade';
  gradeList = [];
  standardList = [];
  teacherList = [];
  isLoadAllStudents = false;
  average:any;
  allStudentList = [];
  studentsInSchool = [];
  profileModal;
  studentDetails;
  hrs:any
  sortBy;
  status;
  // studentList = [
  //   {
  //     district: "District 1",
  //     school: "School 2",
  //     class: "Class 2",
  //     studentPhoto: "./assets/images/student-icon.svg",
  //     studentName: "Samuel, Aaron",
  //     studentId: "36273",
  //     studentGroup: "Red",
  //     actions: [
  //       "SignIn Info",
  //       "Profile",
  //       "Reports"
  //     ],
  //     studentDob: "22/10/1995",
  //     gender: "Male",
  //     grade: "Grade 1",
  //     email: "samual.aron@xyzschools.net",
  //     ethnicity: "Ethnicity 1",
  //     guardian: "Guardian 1",
  //     username: "sam@13",
  //     contactName: "Danial",
  //     contactRelationship: "Relationship 1",
  //     contactEmail: "dan@gmail.com",
  //     contactNumber: "1234567890",
  //     interests: "Cooking",
  //     medicalCondition: "Condition 1",
  //     allergies: "Allergies - Gluten, Latex ",
  //     status: "active"
  //   },
  //   {
  //     district: "District 1",
  //     school: "School 2",
  //     class: "Class 2",
  //     studentPhoto: "./assets/images/student-icon.svg",
  //     studentName: "Ruaz, Kevin",
  //     studentId: "36272",
  //     studentGroup: "Green",
  //     actions: [
  //       "SignIn Info",
  //       "Profile",
  //       "Reports"
  //     ],
  //     studentDob: "22/10/1993",
  //     gender: "Male",
  //     grade: "Grade 2",
  //     email: "ruaz.kevin@xyzschools.net",
  //     ethnicity: "Ethnicity 2",
  //     guardian: "Guardian 2",
  //     username: "kevin@13",
  //     contactName: "Danial",
  //     contactRelationship: "Father",
  //     contactEmail: "dan@gmail.com",
  //     contactNumber: "1234567890",
  //     interests: "Cooking, Singing",
  //     medicalCondition: "Condition 1",
  //     allergies: "Allergies - Gluten, Latex",
  //     status: "inactive"
  //   },
  //   {
  //     district: "District 1",
  //     school: "School 2",
  //     class: "Class 2",
  //     studentPhoto: "./assets/images/student-icon.svg",
  //     studentName: "Keil, Exie",
  //     studentId: "36271",
  //     studentGroup: "Yellow",
  //     actions: [
  //       "SignIn Info",
  //       "Profile",
  //       "Reports"
  //     ],
  //     studentDob: "2/10/1995",
  //     gender: "Male",
  //     grade: "Grade 3",
  //     email: "keil.exie@xyzschools.net",
  //     ethnicity: "Ethnicity 3",
  //     guardian: "Guardian 1",
  //     username: "Keil@12",
  //     contactName: "Danial",
  //     contactRelationship: "Father",
  //     contactEmail: "dan@gmail.com",
  //     contactNumber: "1234567890",
  //     interests: "Magic, Scientific Experiments",
  //     medicalCondition: "Condition 1",
  //     allergies: "Allergies - Gluten, Latex",
  //     status: "active"
  //   },
  //   {
  //     district: "District 1",
  //     school: "School 2",
  //     class: "Class 2",
  //     studentPhoto: "./assets/images/student-icon.svg",
  //     studentName: "Samuel, Aaron",
  //     studentId: "36274",
  //     studentGroup: "Red",
  //     actions: [
  //       "SignIn Info",
  //       "Profile",
  //       "Reports"
  //     ],
  //     studentDob: "22/1/1995",
  //     gender: "Male",
  //     grade: "Grade 3",
  //     email: "samual.aron@xyzschools.net",
  //     ethnicity: "Ethnicity 3",
  //     guardian: "Guardian 3",
  //     username: "sram21",
  //     contactName: "Danial",
  //     contactRelationship: "Father",
  //     contactEmail: "dan@gmail.com",
  //     contactNumber: "1234567890",
  //     interests: "Cooking, Magic, Scientific Experiments",
  //     medicalCondition: "Condition 3",
  //     allergies: "Allergies - Gluten, Latex",
  //     status: "active"
  //   }
  // ];
  studentHeaders = [
    {
      title: 'Student Id',
      data: 'studentId'
    },
    {
      title: 'Student Name',
      data: 'studentName'
    },
    {
      title: 'Allergies',
      data: 'allergies'
    },
    {
      title: 'Actions',
      data: 'actions',
      isClickable: true
    }
  ];
  selectedValue = [];
  selectedStandard = null;
  selectedTeacherValue = [];
  selectedTeacher = null;
  selectedStudentValue = [];
  selectedStudent = null;
  settingsList = [];
  allStudents = [];
  currentSchool: any;
  isLoad = false;
  term: string;
  editModal;
  districtRole: any;
  schoolAddress: string;
  principalAddress: string;
  editSchoolForm: FormGroup;
  createClassForm: FormGroup;
  deletedClasses: any;
  tabTitle:string;
  constructor(
    private toast: ToasterService,
    private modalService: NgbModal,
    private router: Router,
    private districtService: DistrictService,
    private activatedRoute: ActivatedRoute
  ) {
    this.schoolID = this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.id;
    this.tabTitle = this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.action ? this.activatedRoute.snapshot.queryParams.action : 'Info';
  }

  ngOnInit(): void {
    this.districtRole = JSON.parse(localStorage.getItem('districtDetails'));
    if (this.schoolID) {
      this.getSchoolDetails();
      this.teachersApplicationUsage("week");
    }
    this.createClassForm = new FormGroup({
      school: new FormControl(''),
      teacherName: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required, this.validateClassName.bind(this)]),
      grade: new FormControl([], [Validators.required]),
      standards: new FormControl('', [Validators.required]),
      students: new FormControl('')
    });
    this.editSchoolForm = new FormGroup({
      schoolName: new FormControl('', [
        Validators.required,
        Validators.pattern(CustomRegex.namePatteren),
        this.validateSchoolName.bind(this)
      ]),
      adminAccountName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z -']+")]),
      pNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(CustomRegex.phoneNumberPattern),
        // Validators.minLength(10),
        this.validPhoneNumber.bind(this)
      ]),
      emailID: new FormControl('', [Validators.required, Validators.pattern(CustomRegex.emailPattern), this.validateEmail.bind(this)]),
      principalName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.pattern(CustomRegex.phoneNumberPattern),
        // Validators.minLength(10),
        // this.validContactNumber.bind(this)
      ]),
      emailAddress: new FormControl('', [Validators.pattern(CustomRegex.emailPattern)]),
      emergencyContact: new FormControl('', [
        Validators.required,
        Validators.pattern(CustomRegex.phoneNumberPattern),
        // Validators.minLength(10),
        // this.validEmergencyPhoneNumber.bind(this)
      ])
    });
    this.getTopActiveStudents("week")
    this.getInactiveStudents()
  }

  editSchoolModal(modal: any): void {
    this.editModal = this.modalService.open(modal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'membership-modal'
    });
    this.editSchoolForm.get('schoolName').setValue(this.currentSchool.school.name);
    this.editSchoolForm.get('adminAccountName').setValue(this.currentSchool.school.admin_account_name);
    this.editSchoolForm.get('pNumber').setValue(this.currentSchool.phone_number);
    this.schoolAddress = this.currentSchool.school.school_address;
    this.editSchoolForm.get('emailID').setValue(this.currentSchool.email);
    this.editSchoolForm.get('principalName').setValue(this.currentSchool.school.contact_person_name);
    this.editSchoolForm.get('phoneNumber').setValue(this.currentSchool.school.contact_person_number);
    this.editSchoolForm.get('emailAddress').setValue(this.currentSchool.school.contact_person_email);
    this.principalAddress = this.currentSchool.school.contact_person_address;
    this.editSchoolForm.get('emergencyContact').setValue(this.currentSchool.school.emergency_contact_number);
  }

  sameAddress(): void {
    this.principalAddress = this.schoolAddress;
  }

  getSchoolDetails(): void {
    this.districtService.getSchoolById(this.schoolID).subscribe(
      (response) => {
        if (response && response.data) {
          this.currentSchool = response.data;
          this.studentRefresh();
          this.classReports();
          this.settingsRefresh();
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  changeView(event) {
    if (event.menu === 'Tile View') {
      this.ViewTitle = 'Tile View';
      this.gridView = true;
      this.listView = false;
      this.ViewIcon = faThLarge;
    } else {
      this.ViewTitle = 'List View';
      this.gridView = false;
      this.listView = true;
      this.ViewIcon = faList;
    }
  }

  get formControl() {
    return this.editSchoolForm.controls;
  }
  get formControls() {
    return this.createClassForm.controls;
  }

  closeEditSchoolModal(): void {
    this.editModal.close();
  }

  /**
   * To check valid email
   *
   */
  validateEmail(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.emailPattern);
      let emailID = control.value;
      if (isValid && isValid.input) {
        if (this.currentSchool && this.currentSchool.email === control.value) {
          emailID = undefined;
        }
        if (emailID) {
          this.districtService.emailValidator(control.value).subscribe(
            (data) => {},
            (error) => {
              console.log(error);
              this.editSchoolForm.controls['emailID'].setErrors({ emailValidate: true });
            }
          );
        }
      }
    }
  }

  /**
   * To check valid phone number
   *
   */
  validPhoneNumber(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.phoneNumberPattern);
      let contactNo = control.value;
      // if ((control.value && control.value.length === 11) || control.value.length > 13) {
      //   return { digitValidate: true };
      // }
      if (isValid && isValid.input) {
        if (this.currentSchool && this.currentSchool.phone_number === control.value) {
          contactNo = undefined;
        }
        if (contactNo) {
          this.districtService.contactValidator(contactNo).subscribe(
            (data) => {},
            (error) => {
              console.log(error);
              this.editSchoolForm.controls['pNumber'].setErrors({ contactValidate: true });
            }
          );
        }
      }
    }
  }

  // validContactNumber(control: AbstractControl): any {
  //   if (control && control.value) {
  //     if (control.value.length === 11 || control.value.length > 13) {
  //       return { phoneValidate: true };
  //     }
  //   }
  // }
  // validEmergencyPhoneNumber(control: AbstractControl): any {
  //   if (control && control.value) {
  //     if (control.value.length === 11 || control.value.length > 13) {
  //       return { contactDigitValidate: true };
  //     }
  //   }
  // }

  /**
   * API call to edit school details.
   */
  onEditSchool(): void {
    let formData = this.editSchoolForm.value;
    let submission = {
      name: formData.schoolName,
      admin_account_name: formData.adminAccountName,
      email: formData.email,
      phone_number: formData.pNumber,
      school_address: this.schoolAddress,
      contact_person_name: formData.principalName,
      contact_person_number: formData.phoneNumber,
      contact_person_email: formData.emailAddress,
      contact_person_address: this.principalAddress,
      emergency_contact_number: formData.emergencyContact
    };

    if (this.editSchoolForm.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');
      // return;
    } else {
      this.districtService.editSchoolDetails(this.schoolID, submission).subscribe(
        (data) => {
          if (data) {
            this.toast.showToast(`${formData.schoolName} : updated successfully`, '', 'success');
            this.closeEditSchoolModal();
            this.getSchoolDetails();
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
  }
  /**
   * To check valid school Name
   *
   */
  validateSchoolName(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.namePatteren);
      let name = control.value;
      if (isValid && isValid.input) {
        if (this.currentSchool && this.currentSchool.school.name === control.value) {
          name = undefined;
        }
        if (name) {
          this.districtService.schoolNameValidator(control.value).subscribe(
            (data) => {},
            (error) => {
              console.log(error);
              this.editSchoolForm.controls['schoolName'].setErrors({ schoolNameValidate: true });
            }
          );
        }
      }
    }
  }
  /**
   * on click of settings tab.
   */
  settingsRefresh(): void {
    this.districtService.getSettings(this.currentSchool.school.id, this.currentSchool.role.id).subscribe(
      (response) => {
        if (response && response.data) {
          let mappedSettings = [];
          mappedSettings = _.map(response.data, (item) => {
            if (item.key === 'schoolShowPerformanceReportStudent') {
              item['value'] = 'Show performance report in student dashboard for parents';
            } else if (item.key === 'schoolAllowLessonsExplorationsStudent') {
              item['value'] = 'Allow lessons exploration to students';
            } else if (item.key === 'schoolPassportStudent') {
              item['value'] = 'Passport for students';
            }
            return item;
          });
          this.settingsList = _.filter(mappedSettings, (item) => {
            if (item && item.value) {
              return item;
            }
          });
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  onSettingsUpdate(item: any): void {
    let data = {
      settings: []
    };
    data.settings.push({
      id: item.id,
      isEnable: !item.isEnable
    });
    this.districtService.editSettings(data).subscribe(
      (response) => {
        if (response && response.data) {
          this.toast.showToast('Settings updated successfully.', '', 'success');
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
   * On click of student tab.
   *
   */
  studentRefresh(): void {
    this.getAllActiveTeachers();
    this.getAllGradeList();
    this.getAllLearningStandards();
    this.getStudentList();
  }
  getAllActiveTeachers(): void {
    this.districtService.getAllTeacher(1, this.currentSchool.school.id).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          this.teacherList = _.map(response.data.rows, (item) => {
            let obj = {
              item_id: item.teacher.id,
              item_text: `${item.teacher.first_name} ${item.teacher.last_name}`
            };
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
  getAllGradeList(): void {
    this.districtService.getGradeList().subscribe(
      (response) => {
        if (response && response.data) {
          this.gradeList = _.map(response.data, (item) => {
            let obj = {
              id: item.id,
              menu: item.grade
            };
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

  getAllLearningStandards(): void {
    this.districtService.getLearningStandardList().subscribe(
      (response) => {
        if (response && response.data) {
          this.standardList = _.map(response.data, (item) => {
            let obj = {
              item_id: item.id,
              item_text: item.standardTitle
            };
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
   * To get student list and disply in student tab & on drop-down in create class.
   *
   */
  getStudentList(status?: any): void {
    let filterByStatus = status ? status : this.status;
    this.districtService.getAllStudents(filterByStatus, undefined, this.sortBy, this.currentSchool.school.id).subscribe(
      (response) => {
        if (response && response.data && response.data.rows) {
          if (status) { //Calculate student list and display in drop-down of create class.
            this.allStudentList = _.map(response.data.rows, (item) => {
              if (item && item.status) {
                let obj = {
                  item_id: item.id,
                  item_text: `${item.firstName} ${item.lastName}`
                };
                return obj;
              }
            });
          } else {
            this.studentsInSchool = response.data.rows;
            this.allStudents = _.map(response.data.rows, (item) => {
              let allergy = [];
              this.allergenList = null;
              _.map(item.allergens, (allergen) => {
                if (!_.isEmpty(allergen.allergen.allergenTitle)) {
                  allergy.push(allergen.allergen.allergenTitle);
                }
              });
              if (allergy && allergy.length > 0) {
                this.allergenList = allergy.toString();
                this.allergenList = this.allergenList.replace(/,/g, ", ");
              }
              let obj = {
                studentId: item.id,
                studentName: item.firstName + ',' + item.lastName,
                allergies: this.allergenList,
                studentPhoto: item.profileImage ? item.profileImage : './assets/images/student-icon.svg',
                actions: ['SignIn Info', 'Profile', 'Reports']
              };
              return obj;
            });                      
          }
          this.isLoadAllStudents = true;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  addNewStudent(): void {
    this.router.navigate(['/district/add-student'], { queryParams: { sid: this.schoolID } });
  }

  openCreateClass(content: any): void {
    this.getStudentList(1);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'create-class-modal' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'Save') {
        this.onSaveClass();
      } else {
        this.resetForm();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.resetForm();
    });
    this.createClassForm.get('school').setValue(this.currentSchool.school);
    this.schoolTitle = this.currentSchool.school.name;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  } 

  onActionClick(item?: any, name?: any): void {
    let studentId = item ? item.studentId : name.studentId;
    let showPopup = false;
    if (name === 'Profile' && item) {
      showPopup = true;
    } else if (name.action === 'Profile' && studentId) {
      showPopup = true;
    }
    let allergy = [];
    let allergieString: string;
    if (showPopup) {
      this.studentDetails = this.studentsInSchool.find((o) => o.id === studentId);
      _.forEach(this.studentDetails.allergens, ob => {
        if (!_.isEmpty(ob.allergen.allergenTitle)) {
          allergy.push(ob.allergen.allergenTitle)
        }
      });
      if (allergy && allergy.length > 0) {
        allergieString = allergy.toString();
        allergieString = allergieString.replace(/,/g, ", ");
      }
      this.studentDetails['allergieString'] = allergieString;
      this.studentDetails.img = this.studentDetails.profileImage ? this.studentDetails.profileImage : './assets/images/student-icon.svg';
      this.openProfile(this.ProfileModal);
    }
  }
  openProfile(modal: any): void {
    this.profileModal = this.modalService.open(modal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'add-student--modal'
    });
  }

  closeProfileModal(): void {
    this.profileModal.close();
  }
  /**
   * To check valid class Name
   *
   */
  validateClassName(control: AbstractControl): any {
    if (control && control.value) {
      let isValid = control.value.match(CustomRegex.schoolNamePattern);
      if (isValid && isValid.input) {
        this.districtService.classNameValidator(control.value).subscribe(
          (data) => {},
          (error) => {
            console.log(error);
            this.createClassForm.controls['title'].setErrors({ classNameValidate: true });
          }
        );
      }
    }
  }
  resetForm() {
    this.status = undefined;
    this.createClassForm.reset();
    this.selectedTeacher = null;
    this.selectedStandard = null;
    this.selectedStudent = null;
    this.selectedStudentValue = [];
    this.selectedValue = [];
    this.selectedTeacherValue = [];
    this.gradeTitle = 'Select the grade';
  }

  /**
   * On grade dropdown value change
   */
  gradeChange(event) {
    this.gradeTitle = event.menu;
    this.createClassForm.get('grade').setValue(event);
  }
  // schoolChange(event) {
  //   this.schoolTitle = event.menu;
  //   this.createClassForm.get('school').setValue(event);
  // }
  onSelectStandrd(item) {
    this.selectedValue.push(item);
    this.selectedStandard = this.selectedValue;
    this.createClassForm.get('standards').setValue(this.selectedStandard);
  }

  onDeSelectStandard(index) {
    this.selectedValue = [];
    // this.selectedStandard.splice(index, 1);
    this.selectedStandard = this.selectedStandard.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedValue = this.selectedStandard;
    this.createClassForm.get('standards').setValue(this.selectedStandard);
  }
  onSelectAllStandard(item) {
    this.selectedValue = [];
    this.selectedValue = item;
    this.selectedStandard = this.selectedValue;
    this.createClassForm.get('standards').setValue(this.selectedStandard);
  }

  onDeselectAllStandard(item) {
    this.selectedValue = item;
    this.createClassForm.get('standards').setValue(this.selectedValue);
  }

  onSelectTeacher(item) {
    this.selectedTeacherValue.push(item);
    this.selectedTeacher = this.selectedTeacherValue;
    this.createClassForm.get('teacherName').setValue(this.selectedTeacher);
  }

  onDeSelectTeacher(index) {
    this.selectedTeacherValue = [];
    // this.selectedTeacher.splice(index, 1);
    this.selectedTeacher = this.selectedTeacher.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedTeacherValue = this.selectedTeacher;
    this.createClassForm.get('teacherName').setValue(this.selectedTeacher);
  }
  onSelectAllTeacher(item) {
    this.selectedTeacherValue = [];
    this.selectedTeacherValue = item;
    this.selectedTeacher = this.selectedTeacherValue;
    this.createClassForm.get('teacherName').setValue(this.selectedTeacher);
  }

  onDeselectAllTeacher(item) {
    this.selectedTeacherValue = item;
    this.createClassForm.get('teacherName').setValue(this.selectedTeacherValue);
  }

  onSelectStudent(item) {
    this.selectedStudentValue.push(item);
    this.selectedStudent = this.selectedStudentValue;
    this.createClassForm.get('students').setValue(this.selectedStudent);
  }

  onDeSelectStudent(index) {
    this.selectedStudentValue = [];
    // this.selectedStudent.splice(index, 1);
    this.selectedStudent = this.selectedStudent.filter(function (obj) {
      return obj.item_id !== index.item_id;
    });
    this.selectedStudentValue = this.selectedStudent;
    this.createClassForm.get('students').setValue(this.selectedStudent);
  }
  onSelectAllStudent(item) {
    this.selectedStudentValue = [];
    this.selectedStudentValue = item;
    this.selectedStudent = this.selectedStudentValue;
    this.createClassForm.get('students').setValue(this.selectedStudent);
  }

  onDeselectAllStudent(item) {
    this.selectedStudentValue = item;
    this.createClassForm.get('students').setValue(this.selectedStudentValue);
  }
  gradeFilter(event) {
    this.sortByIdTitle = event.menu;
    this.sortBy = event.value ? event.value : undefined; 
    this.getStudentList();
  }
  /**
   * Active/inactive filter.
   * @param item
   */
  studentFilter(item: any): void {
    this.filterListtitle = item.menu;
    this.status = item.id ? item.id : undefined; 
    this.getStudentList();
  }
  onSaveClass(): void {
    if (this.createClassForm.invalid) {
      this.toast.showToast('Please enter information for required fields', '', 'error');
    } else {
      let teacher = [];
      let stdList = [];
      let students = [];
      _.forEach(this.selectedTeacherValue, (item) => {
        teacher.push(item.item_id);
      });
      _.forEach(this.selectedValue, (item) => {
        stdList.push(item.item_id);
      });
      _.forEach(this.selectedStudentValue, (item) => {
        students.push(item.item_id);
      });
      let formData = this.createClassForm.value;
      let submission = {
        title: formData.title,
        district_id: JSON.parse(localStorage.getItem('districtDetails')).id,
        grade_id: formData.grade.id,
        school_id: formData.school.id,
        assigned_teacher_ids: teacher,
        assigned_standard_ids: stdList,
        assigned_student_ids: students
      };
      this.districtService.addClassDetails(submission).subscribe(
        (data) => {
          if (data) {
            this.toast.showToast(`${formData.title} : Class added successfully.`, '', 'success');
            this.resetForm();
            this.studentRefresh();
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
  }

  classReports() {
    this.districtService.getClassReport(this.currentSchool.school.id, 'week').subscribe((res) => {
      if (res.data) this.classes = res.data.count;
    });
    this.districtService.getAllDeletedClasses(this.currentSchool.school.id, 'week').subscribe((res) => {
      let count = 0;
      _.map(res.data.rows, (item) => {
        if (item.deleted_at != null) count = count + 1;
      });
      this.deletedClasses = count;
    });
    this.StudentApplicationUsage('week');
  }

  StudentApplicationUsage(duration) {
    this.districtService.getAllStudents(1).subscribe((response) => {
      _.map(response.data.rows, (item) => {
       this.newStudents=response.data.count
        this.districtService.getTopActiveSessionStudents(duration, item.id).subscribe((res) => {
          if (res && res.data) {
            _.map(res.data.rows, (objItem) => {
              if (objItem.session_mins != null || objItem.session_mins != NaN) this.mins = (this.mins + objItem.session_mins/res.data.count)/60;
            });
          }
        });
      });
    });
  }

  generatePDF() {
    var data = document.getElementById('generatePdf');
    html2canvas(data).then((canvas) => {
      var imgWidth = 208;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save('school_detail.pdf');
    });
  }

  teachersApplicationUsage(duration) {
    this.districtService.getAllStudents(1).subscribe((response) => {
      _.map(response.data.rows, (item) => {
       this.newStudents=response.data.count
        this.districtService.getTopActiveSessionStudents(duration, item.id).subscribe((res) => {
          if (res && res.data) {
            _.map(res.data.rows, (objItem) => {
              if (objItem.session_mins != null || objItem.session_mins != NaN) this.mins = (this.mins + objItem.session_mins/res.data.count)/60;
            });
          }
        });
      });
    });
    this.districtService.getAllTeacher(1).subscribe((response) => {
      _.map(response.data.rows, (item) => {
        this.districtService.getTopActiveSessionTeachers(duration,item.id).subscribe((res) => {
          if (res && res.data) {
            _.map(res.data.rows, (objItem) => {
              if (objItem.session_mins != null || objItem.session_mins != NaN) this.teacherMins = (this.teacherMins + objItem.session_mins/res.data.count)/60;
              this.average=((this.teacherMins+this.mins)/2).toFixed(2);  
           });
          }
        });
      });
    });
  }


  getTopActiveStudents(duration) {
    this.districtService.getAllStudents(1,undefined).subscribe((response) => {
      _.map(response.data.rows, (item) => {
        this.newStudents=response.data.count
         this.districtService.getTopActiveSessionStudents(duration, item.id).subscribe((res) => {
           if (res && res.data) {
             _.map(res.data.rows, (objItem) => {
               if (objItem.session_mins != null || objItem.session_mins != NaN) this.mins = (this.mins + objItem.session_mins/res.data.count)/60;
               this.hrs=this.mins.toFixed(2);
             });
           }
         });
       });
    });
   
  }


  getInactiveStudents() {
    this.districtService.getNewStudents(0,"week").subscribe((response) => {
       this.inactiveStudents=response.data.count
    });
   
  }
}
