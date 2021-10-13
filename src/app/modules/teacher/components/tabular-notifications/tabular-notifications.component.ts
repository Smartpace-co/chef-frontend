import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  faChevronRight,
  faAngleLeft,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tabular-notifications',
  templateUrl: './tabular-notifications.component.html',
  styleUrls: ['./tabular-notifications.component.scss']
})
export class TabularNotificationsComponent implements OnInit {
  RightArrow = faChevronRight;
  LeftArrow = faAngleLeft;
  constructor() { }

  ngOnInit(): void {
  }

  classroomList=[
    {
      id:'1',
      type:'STUDENT ACTIVITY',
      info:'13 students completed your assignment ‘Classic Waffles’',
      time:'2 Hours Ago',
      status:'View Report'
    },
    {
      id:'2',
      type:'NEW STUDENT',
      info:'Ruaz, Kevin and 3 others accepted the invitation to your class.',
      time:'Friday, March 6',
      status:'View Report'
    },
    {
      id:'3',
      type:'NEW CLASS',
      info:'You have created a new class ‘Ms. Paula’s Class: Room 112’',
      time:'Thursday, March 5',
      status:'View Report'
    },
    {
      id:'4',
      type:'NEW ACCOUNT',
      info:'Welcome to Chef Koochooloo',
      time:'',
      status:'View Report'
    }
  ]

  platformList=[
    {
      id:'1',
      type:'NEW FEATURE',
      info:'‘Suggest your own content’ feature has been added',
      time:'2 Hours Ago',
      status:'View Report'
    },
    {
      id:'2',
      type:'NEW COUNTRY',
      info:'Argentina has been added recently and has 6 recipes so far',
      time:'Friday, March 6',
      status:'View Report'
    },
    {
      id:'3',
      type:'NEW RECIPE',
      info:'Dumplings has been added recently to the Recipes ',
      time:'Thursday, March 5',
      status:'View Report'
    }
  ]
}
