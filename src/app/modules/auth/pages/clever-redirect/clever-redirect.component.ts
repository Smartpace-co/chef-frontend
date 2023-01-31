import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { AuthService } from '@modules/auth/services/auth.service';

import { getNavigateToByRole } from '../../services/utils';

const Auth_Pages = {
  teacher: '/auth/register-teacher',
  student: '/auth/student-signup',
  school: '/auth/register-school',
  district: '/auth/register-admin'
};

@Component({
  selector: 'app-clever-redirect',
  templateUrl: './clever-redirect.component.html',
  styleUrls: ['./clever-redirect.component.scss']
})
export class CleverRedirectComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private toast: ToasterService) {}

  ngOnInit(): void {
    const cleverSecret = this.route.snapshot.queryParams['clever-secret'];
    this.checkQueryForCleverUser(cleverSecret);
  }

  private checkQueryForCleverUser(cleverSecret) {
    const queryError = this.route.snapshot.queryParams['error'];

    if (cleverSecret === 'internal-server-error') {
      this.toast.showToast('server error', '', 'error');
      this.router.navigate(['/auth/login']);
    } else if (cleverSecret === 'invalid-redirect') {
      this.toast.showToast(queryError, '', 'error');
      this.router.navigate(['/auth/login']);
      // } else if (!!!this.authService.currentUserValue && cleverSecret) {
    } else if (cleverSecret) {
      if (cleverSecret === 'signup') {
        // loginData will added after create account with a response
        const loginData = this.authService.getCleverSinupDataTemp();
        if (loginData) {
          this.setDataAfterCleverLogin(loginData);
        } else {
          this.toast.showToast('Invalid link', '', 'error');
          this.router.navigate(['/auth/login']);
        }
      } else {
        // try Login
        this.tryCleverLogin(cleverSecret);
      }
    } else {
      this.toast.showToast('Invalid link', '', 'error');
      this.router.navigate(['/auth/login']);
    }
  }

  syncUserWithClever(userId, type) {
    if (userId && type) {
      this.authService.syncUserWithClever(userId, type).subscribe((res) => {
        const dataStr = sessionStorage.getItem('currentUser');
        const localData = JSON.parse(dataStr);
        const newData = {...localData, ...res.data}
        sessionStorage.setItem('currentUser', JSON.stringify(newData));
  
      });
    }
  }

  private async tryCleverLogin(cleverSecret) {
    try {
      this.authService.cleverTryLogin(cleverSecret).subscribe(
        (res: any) => {
          const { data } = res;
          if (!data.is_completed) {
            localStorage.setItem('user-temp', JSON.stringify(data));
            const pagePath = Auth_Pages[data.cleverRole];
            this.router.navigate([pagePath]);
          } else {
            this.setDataAfterCleverLogin(data);
            // sync request with clever;
            setTimeout(()=> {
              const userId = data.id;
              const type = data.role?.title?.toLowerCase();
              if (userId && type) {
                this.syncUserWithClever(userId, type);
              }
            }, 1000)
          }
        },
        (err) => {
          this.toast.showToast(err.error.message, '', 'error');
          this.router.navigate(['/auth/login']);
        }
      );
    } catch (err) {
      this.toast.showToast(err.error.message, '', 'error');
      this.router.navigate(['/auth/login']);
    }
  }

  private setDataAfterCleverLogin(data: any) {
    this.authService.cleverLogin(data);

    if (data.is_trial_period_end && data.isPaymentRemaining) {
      if (data.parentId) {
        this.toast.showToast('Contact your admin', '', 'error');
        this.router.navigate(['/auth/login']);
      }
      if (!data.parentId) {
        localStorage.setItem('show-payment-request-from-redirect', '1');
        this.router.navigate(['/auth/login']);
      }

      return;
    }

    // 4) handle navigate
    this.handleNavigate(data);
  }

  private handleNavigate(data: any): void {
    // First check Parent_role
    if (data.parent_role) {
      if (data.parent_role && data.isPaymentRemaining != true) {
        const navigateTo = getNavigateToByRole(data.parent_role);
        this.router.navigate([navigateTo]);
      } else {
        this.toast.showToast('Contact your admin', '', 'error');
        this.router.navigate(['/auth/login']);
      }
      return;
    }

    // Check user without Parent_role
    if (data.role && data.role.title) {
      const navigateTo = getNavigateToByRole(data.role.title);
      this.router.navigate([navigateTo]);
    } else {
      this.toast.showToast('Not a valid user', '', 'warning');
      this.router.navigate(['/auth/login']);
    }
  }
}
