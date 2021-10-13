import { Component, OnInit } from '@angular/core';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { ToasterService } from '@appcore/services/toaster.service';
@Component({
  selector: 'app-student-free-access',
  templateUrl: './student-free-access.component.html',
  styleUrls: ['./student-free-access.component.scss']
})
export class StudentFreeAccessComponent implements OnInit {
  freeAccessCodeForm: FormGroup;
  gradeTitle = "Select Your Grade"
  gradeList = [
    {
      id: "1",
      menu: "1"
    },
    {
      id: "2",
      menu: "2"
    },
    {
      id: "3",
      menu: "3"
    },
    {
      id: "4",
      menu: "4"
    }
  ]
  constructor() { }

  ngOnInit(): void {
    this.freeAccessCodeForm = new FormGroup({
      chefAccessCode: new FormControl('', [Validators.required]),
    });
  }
  get formControl() {
    return this.freeAccessCodeForm.controls;
  }

}
