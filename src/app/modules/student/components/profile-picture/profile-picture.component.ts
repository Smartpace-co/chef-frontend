import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import {
  faChevronRight,
  faAngleLeft,
} from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';


@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit {
  LeftArrow = faAngleLeft;

  constructor(private router: Router, private studentService: StudentService, private toast: ToasterService) { }
  profileImgList = [
    {
      id: 1,
      profileUrl: "./assets/images/profile-icon-2.png"
    },
    {
      id: 2,
      profileUrl: "./assets/images/profile-icon-4.png"
    },
    {
      id: 3,
      profileUrl: "./assets/images/profile-icon-7.png"
    }
  ]
  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate(['/student/profile-info']);
  }
  onSelectImg(item: any): void {
    if (item && item.profileUrl) {
      let data = { profileImage: item.profileUrl };
      this.studentService.editStudentDetails(JSON.parse(window.sessionStorage.getItem('currentUser')).id, data).subscribe(
        (data) => {
          if (data) {
            this.toast.showToast('Profile picture updated successful', '', 'success');
            this.onBack();
            this.studentService.setProfileImage(item.profileUrl);
          }
        },
        (error) => {
          console.log(error);
          this.toast.showToast(error.error.message, '', 'error');
        }
      );
    }
  }
}
