import { Component, OnInit } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  CheckIcon = faCheck;
  sessionId: any;
  subscribeId: any;
  token: any;
  currentLoggedUser:any
  constructor( private router: Router, private actRoute: ActivatedRoute, private authService:AuthService) { 
    if (this.actRoute.snapshot && this.actRoute.snapshot.queryParams.session_id && this.actRoute.snapshot.queryParams.subscribe_id) {
      this.sessionId = this.actRoute.snapshot.queryParams.session_id;
      this.subscribeId = this.actRoute.snapshot.queryParams.subscribe_id;
    }
  }

  ngOnInit(): void {
    this.authService.getGuestUserToken().subscribe(
      (response) => {
        this.token = response.data.guestToken;
        if (this.token) {
          let data={
            subscribeId:this.subscribeId,
            sessionId: this.sessionId
          }
          this.authService.saveTransaction(data,this.token).subscribe((dt)=>{
            console.log(dt)
          },
          (error)=>{
            console.log(error)
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * Navigate to login page
   */

  goToLogin(){
 window.sessionStorage.removeItem("currentUser")
 /* if (this.currentLoggedUser && this.currentLoggedUser.token) {
    if(this.currentLoggedUser.role.title=='School')
    {
      this.router.navigate(['/school/membership-details']);

    }
    else if(this.currentLoggedUser.role.title=='District')
    {
      this.router.navigate(['/district/membership-details']);

    }

  }
  else
  {*/
       this.router.navigate(['/auth/login']);
 // }
  }
}
