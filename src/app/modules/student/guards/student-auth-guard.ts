import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';

@Injectable()
export class StudentAuthGuard implements CanActivate {
  constructor(private route: Router, public translate: TranslateService, private authService: AuthService, private toast: ToasterService) { }
  token = this.authService.isUserSignedIn();
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (state.url.includes('/auth/login') || state.url.includes('/auth/forgot-password') || state.url.includes('/auth/register')) {
      if (this.token) {
        this.route.navigate(['']);
        return false;
      } else {
        return true;
      }
    } else if (
      state.url.includes('') ||
      state.url.includes('student/dashboard') ||
      state.url.includes('student/class-info') ||
      state.url.includes('student/class-details') ||
      state.url.includes('student/settings') ||
      state.url.includes('student/assignment') ||
      state.url.includes('student/notifications') ||
      state.url.includes('student/student-landing') ||
      state.url.includes('student/explore-lesson') ||
      state.url.includes('student/learning-objective') ||
      state.url.includes('student/summary-view') ||
      state.url.includes('student/greeting') ||
      state.url.includes('student/introduction') ||
      state.url.includes('student/find-country') ||
      state.url.includes('student/country-location') ||
      state.url.includes('student/recipe-fact') ||
      state.url.includes('student/recipe-content') ||
      state.url.includes('student/linguistic-details') ||
      state.url.includes('student/let-start') ||
      state.url.includes('student/conversional-sentence') ||
      state.url.includes('student/safety-hygiene') ||
      state.url.includes('student/ingredient-list') ||
      state.url.includes('student/ingredients') ||
      state.url.includes('student/ingredient') ||
      state.url.includes('student/cooking-preparation') ||
      state.url.includes('student/cooking-technique') ||
      state.url.includes('student/cooking-steps') ||
      state.url.includes('student/experiment') ||
      state.url.includes('student/experiment-steps') ||
      state.url.includes('student/experiment-observation') ||
      state.url.includes('student/experiment-description') ||
      state.url.includes('student/start-experiment') ||
      state.url.includes('student/experiment-question') ||
      state.url.includes('student/cleaning') ||
      state.url.includes('student/serving') ||
      state.url.includes('student/assessment-question') ||
      state.url.includes('student/action-activities') ||
      state.url.includes('student/action-activity-question') ||
      state.url.includes('student/games-listing') ||
      state.url.includes('student/profile-picture') ||
      state.url.includes('student/profile-info') ||
      state.url.includes('student/sensory-exercise') ||
      state.url.includes('student/locker-room') ||
      state.url.includes('student/lesson-report') ||
      state.url.includes('student/order-ingredient') ||
      state.url.includes('student/ratings') ||
      state.url.includes('student/stamps') ||
      state.url.includes('student/assessment-dragndrop') ||
      state.url.includes('student/flag-match') ||
      state.url.includes('student/safety-dragndrop') ||
      state.url.includes('student/flag-game') ||
      state.url.includes('student/health-hygiene-question-water') ||
      state.url.includes('student/health-hygiene-question-exercise') ||
      state.url.includes('student/health-hygiene-fruit-veggie') ||
      state.url.includes('student/flip-games') ||
      state.url.includes('student/membership-details')

      // state.url.includes('student/story') ||
      // state.url.includes('student/explore-lesson') ||
      // state.url.includes('student/hygiene') ||
      // state.url.includes('student/boiling-experiment') ||
      // state.url.includes('student/cooking-preparation') ||
      // state.url.includes('student/ingredient-details') ||
      // state.url.includes('student/culinary-technique') ||
      // state.url.includes('student/science-experiment') ||
      // state.url.includes('student/cleaning') ||
      // state.url.includes('student/serving') ||
      // state.url.includes('student/fun-activity') ||
      // state.url.includes('student/exercise') ||
      // state.url.includes('student/overview')||
      // state.url.includes('student/assessment')
      // state.url.includes('student/action-activity')
    ) {
      if (this.authService.isUserSignedIn() === true && this.authService.getCurrentUserRole() === 'student') {
        return true;
      } else {
        this.route.navigate(['auth/login']);
        if (!_.isEmpty(this.authService.getCurrentUserRole())) {
          this.toast.showToast('Not Authorized User !', '', 'error');
        }
        return false;
      }
    } else {
      this.toast.showToast('Not Logged In !', '', 'error');
    }
  }
}
