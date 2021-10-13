import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { AuthService } from '@modules/auth/services/auth.service';
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
    this.getAllRole();
  }

  getAllRole(): void {
    this.authService.getAllMasterRoleDetails().subscribe(
      (response) => {
        console.log(response)
        let mappedData = [];
        if (response && response.data) {
          mappedData = _.map(response.data, item => {
            item.value = item.title;
            let roleName = item.title.toLowerCase();
            if (roleName === 'student') {
              item.img = './assets/images/kevin.png';
              item.alignment = 'bottom'
            } else if (roleName === 'teacher') {
              item.img = './assets/images/teacher-1.png',
                item.alignment = 'bottom'
            } else if (roleName === 'school') {
              item.img = './assets/images/school.png',
                item.alignment = 'centered'
            } else if (roleName === 'district') {
              item.img = './assets/images/district.png',
                item.alignment = 'centered'
            }
            return item;
          });

          _.forEach(mappedData, ele => {
            if (ele && ele.img && !_.isEmpty(ele.img)) {
              this.roleDetails.push(ele);
            }
          });
          this.isLoad = true;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
        this.isLoad = false;
      }
    );
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
