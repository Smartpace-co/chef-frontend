import { Component, OnChanges, OnInit } from '@angular/core';
import { UtilityService } from '@appcore/services/utility.service';
import { ClassesService } from '@modules/teacher/services/classes.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit, OnChanges {
  tableHeader = [
    { title: 'Student Id', data: 'id' },
    { title: 'First Name', data: 'firstName' },
    { title: 'Last Name', data: 'lastName' }
  ];

  teacherData = [
    { id: '10', firstName: 'Cartman', lastName: 'Titi' },
    { id: '11', firstName: 'Toto', lastName: 'Lara' },
    { id: '22', firstName: 'Luke', lastName: 'Yoda' },
    { id: '26', firstName: 'Foo', lastName: 'Moliku' },
    { id: '31', firstName: 'Luke', lastName: 'Someone Last Name' },
    { id: '32', firstName: 'Batman', lastName: 'Lara' },
    { id: '37', firstName: 'Zed', lastName: 'Kyle' },
    { id: '39', firstName: 'Louis', lastName: 'Whateveryournameis' },
    { id: '41', firstName: 'Superman', lastName: 'Yoda' }
  ];

  classListCount;
  localData: any;
  classList = [];
  constructor(private classService: ClassesService, private utilityService: UtilityService) {}
  ngOnChanges() {}

  ngOnInit(): void {
    this.classService.getClassListObs().subscribe((classList$) => {
      if (classList$ == null) {
        this.getClassListCount();
      }
      else{
        this.classListCount  = classList$.length;
      }
    });
    // Get the sessionStoarge data
    this.localData = JSON.parse(window.sessionStorage.getItem('currentUser'));
  }

  /**
   * Get logged-in user class list count to hide/show create class popup
   */
  getClassListCount() {
    this.classService.getData().subscribe((response: []) => {
      response.forEach((element: any) => {
        if (this.utilityService.strictCompare(element.email, this.localData.email)) {
          if (element.classList.length > 0) {
            this.classListCount = element.classList.length;
          } else {
            this.classListCount = 0;
          }
        }
      });
    });
  }
}
