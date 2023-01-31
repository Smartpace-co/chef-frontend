import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';

import * as _ from 'lodash';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  isLoad = false;
  roleDetails = [];
  // roleList=[];
  roleList = [
    { name: 'Student', id: 1, value: 'Student', img: './assets/images/kevin.png', alignment: 'bottom' },
    { name: 'Teacher', id: 2, value: 'Teacher', img: './assets/images/teacher-1.png', alignment: 'bottom' },
    { name: 'School', id: 3, value: 'School', img: './assets/images/school.png', alignment: 'centered' },
    { name: 'District', id: 2, value: 'District', img: './assets/images/district.png', alignment: 'centered' }];
  constructor(private router: Router,
    private toast: ToasterService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoad = false;

    this.getAllRole();

  }

  redirectClever(){    
    const uri = encodeURIComponent(environment.cleverRedirectURI);

    let link = `https://clever.com/oauth/authorize?response_type=code&redirect_uri=${uri}&client_id=${environment.cleverClientId}`;
  
    /**
     * To work local
     * 1. first, you have to get a "clever_token" by run your code with real link to skip redirect_url by clever
     * 2. use clever_token in your server
     */
    if(!environment.production){
      link = `http://localhost:3001/oauth/clever`;
    }
    window.location.href = link;
  }

  getAllRole(): void {

    this.authService.getRolesMaster().subscribe(res=> {
      this.isLoad = true;
      this.roleDetails = res;
    }, (error)=> {
      this.toast.showToast(error.error.message, '', 'error');
    })

  }

  getRole(item: any): void {
    if (item && item.value) {
      localStorage.setItem('rolID', item.id);
      let rolName = item.value.toLowerCase();
      if (rolName === 'student') {
        this.router.navigate(['/auth/student-signup']);
      } else if (rolName === 'teacher') {
        // this.router.navigate(['/auth/register-teacher'], { queryParams: { role_id: item.id } });
        this.router.navigate(['/auth/register-teacher']);
      } else if (rolName === 'school') {
        this.router.navigate(['/auth/register-school']);
      } else if (rolName === 'district') {
        this.router.navigate(['/auth/register-admin']);
      }
    }
  }
}
