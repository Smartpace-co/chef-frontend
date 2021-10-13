import { Component, OnInit } from '@angular/core';
import { CustomRegex } from '@appcore/validators/custom-regex';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { ToasterService } from '@appcore/services/toaster.service';
@Component({
  selector: 'app-access-code',
  templateUrl: './access-code.component.html',
  styleUrls: ['./access-code.component.scss']
})
export class AccessCodeComponent implements OnInit {
  accessCodeForm: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.accessCodeForm = new FormGroup({
      accessCode: new FormControl('', [Validators.required])
    });
  }
  get formControl() {
    return this.accessCodeForm.controls;
  }
}
