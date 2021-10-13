import { Component, OnInit } from '@angular/core';
import{
  faEdit
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-current-membership-plan',
  templateUrl: './current-membership-plan.component.html',
  styleUrls: ['./current-membership-plan.component.scss']
})
export class CurrentMembershipPlanComponent implements OnInit {
  faEdit = faEdit;
  constructor() { }

  ngOnInit(): void {
  }

}
