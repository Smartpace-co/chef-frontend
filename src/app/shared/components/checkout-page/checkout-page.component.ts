import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AuthService } from '@modules/auth/services/auth.service';
declare var Stripe;

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit {
  sessionId: any;
  stripe:any;
  constructor( private actRoute: ActivatedRoute, private authService:AuthService) {
    this.stripe = Stripe(environment.public_key); 
    if (this.actRoute.snapshot && this.actRoute.snapshot.queryParams) {
      let queryString = Object.keys(this.actRoute.snapshot.queryParams)[0];
      if (queryString) {
        let data = this.authService.queryParamsToJSON(queryString);
         if(data.session_id){
          this.stripe.redirectToCheckout({
            sessionId: data.session_id,
          })
        } 
      }
    }


    this.sessionId = this.actRoute.snapshot.queryParams.session_id;

  }

  ngOnInit(): void {
  }

}
