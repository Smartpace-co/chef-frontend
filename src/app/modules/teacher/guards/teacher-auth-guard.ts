import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';

@Injectable()
export class TeacherAuthGuard implements CanActivate {
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
      state.url.includes('teacher/class-list') ||
      state.url.includes('teacher/user-profile') ||
      state.url.includes('teacher/add-student') ||
      state.url.includes('teacher/edit-student') ||
      state.url.includes('teacher/import-student') ||
      state.url.includes('teacher/student-list') ||
      state.url.includes('teacher/class-info') ||
      state.url.includes('teacher/dashboard') ||
      state.url.includes('teacher/upcoming-assignment') ||
      state.url.includes('teacher/setting') ||
      state.url.includes('teacher/teacher-profile') ||
      state.url.includes('teacher/explore-lessons') ||
      state.url.includes('teacher/explore-lessons-list') ||
      state.url.includes('teacher/explore-lessons-setting') ||
      state.url.includes('teacher/individual-student-assignment-details') ||
      state.url.includes('teacher/current-assignments') ||
      state.url.includes('teacher/tabular-notifications') ||
      state.url.includes('teacher/customize-assign-lesson') ||
      state.url.includes('teacher/teacher-instructions') ||
      state.url.includes('teacher/teacher-bookmark') ||
      state.url.includes('teacher/current-membership-plan') ||
      state.url.includes('teacher/order-ingredients') ||
      state.url.includes('teacher/add-roster') ||
      state.url.includes('teacher/roster-group-tabs') ||
      state.url.includes('teacher/archived-classes') ||
      state.url.includes('teacher/roster-assignment-details') ||
      state.url.includes('teacher/teacher-performance') ||
      state.url.includes('teacher/teacher-homepage') ||
      state.url.includes('teacher/action-activity') ||
      state.url.includes('teacher/journal') ||
      state.url.includes('teacher/conversional-sentence') ||
      state.url.includes('teacher/assessment-question') ||
      state.url.includes('teacher/cooking-preparation') ||
      state.url.includes('teacher/cooking-technique') ||
      state.url.includes('teacher/introduction') ||
      state.url.includes('teacher/find-country') ||
      state.url.includes('teacher/country-location') ||
      state.url.includes('teacher/experiment') ||
      state.url.includes('teacher/cleaning') ||
      state.url.includes('teacher/serving') ||
      state.url.includes('teacher/learning-objective') ||
      state.url.includes('teacher/summary-view') ||
      state.url.includes('teacher/greeting') ||
      state.url.includes('teacher/ingredient-list') ||
      state.url.includes('teacher/ingredient') ||
      state.url.includes('teacher/social-studies-fact') ||
      state.url.includes('teacher/recipe-fact') ||
      state.url.includes('teacher/recipe-content') ||
      state.url.includes('teacher/linguistic-details') ||
      state.url.includes('teacher/let-start') ||
      state.url.includes('teacher/nutrient-question') ||
      state.url.includes('teacher/sensory-question') ||
      state.url.includes('teacher/cooking-steps') ||
      state.url.includes('teacher/safety-hygiene') ||
      state.url.includes('teacher/sensory-exercise') ||
      state.url.includes('teacher/experiment-steps') ||
      state.url.includes('teacher/experiment-description') ||
      state.url.includes('teacher/experiment-question') ||
      state.url.includes('teacher/start-experiment') ||
      state.url.includes('teacher/discussion-forum') ||
      state.url.includes('teacher/discussion-forum-inner') ||
      state.url.includes('teacher/explore-all-lesson') ||
      state.url.includes('teacher/lesson-standard-list') ||
      state.url.includes('teacher/notifications') ||
      state.url.includes('teacher/membership-details') ||
      state.url.includes('teacher/edit-membership') ||
      state.url.includes('teacher/billing')
    ) {
      console.log("hi teacher")
      if (this.authService.isUserSignedIn() === true && this.authService.getCurrentUserRole() === 'teacher') {
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
