import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {
  public assetPath = environment.assetUrl;
  public loggedIn;
  constructor(private router: Router, private authService: AuthService, private toast: ToasterService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((data) => {
      if (data){
        this.loggedIn = true;
      }else{
        this.loggedIn = false;
      }
    });
    // this.loggedIn = window.sessionStorage.getItem('currentUser') ? true: false;
  }

  /**
   * Logout from the current applicationa and
   * redirect to home page
   */
  logout() {
    this.authService.logoutUser().subscribe(
      (data) => {
        if (data) {
          this.toast.showToast('Logout Successful', '', 'success');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
