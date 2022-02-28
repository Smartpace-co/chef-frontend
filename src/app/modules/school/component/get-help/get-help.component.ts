import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-get-help',
  templateUrl: './get-help.component.html',
  styleUrls: ['./get-help.component.scss']
})
export class GetHelpComponent implements OnInit {

  contactList;
  constructor() { }

  ngOnInit(): void {
    this.contactList = {
      photo: "./assets/images/help-profile2.png",
      email: 'support@chefkoochooloo.com'
    };
  }
}
