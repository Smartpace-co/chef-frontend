import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';

@Injectable({providedIn: "root"})
export class SchoolAuthGuard implements CanActivate {

   
    constructor(private route: Router, public translate: TranslateService, private authService: AuthService, private toast: ToasterService) { }
    token = this.authService.isUserSignedIn();
    canActivate(route: ActivatedRouteSnapshot,  state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (state.url.includes('/auth/login') || state.url.includes('/auth/forgot-password') || state.url.includes('/auth/register')) {
            if (this.token) {
                this.route.navigate(['']);
                return false;
            } else {
                return true;
            }
        } else
            if (
                state.url.includes('') ||
                state.url.includes('school/dashboard') ||
                state.url.includes('school/user-profile') ||
                state.url.includes('school/admin-users-role') ||
                state.url.includes('school/add-roles') ||
                state.url.includes('school/admin-user') ||
                state.url.includes('school/import-user')  ||
                state.url.includes('school/school-profile') ||
                state.url.includes('school/admin-teacher') ||
                state.url.includes('school/add-teacher')  ||
                state.url.includes('school/admin-classes') ||
                state.url.includes('school/class-details') ||
                state.url.includes('school/admin-student') ||
                state.url.includes('school/add-student') ||
                state.url.includes('school/common-questions')||
                state.url.includes('school/report-issue') ||
                state.url.includes('school/student-profile')||
                state.url.includes('school/content-settings') ||
                state.url.includes('school/school-settings')||
                state.url.includes('school/discussion-forum-inner') ||
                state.url.includes('school/discussion-forum') ||
                state.url.includes('school/report-issue-history')||
                state.url.includes('school/membership-details') ||
                state.url.includes('school/edit-membership')||
                state.url.includes('school/billing') ||
                state.url.includes('school/report-history-inner') ||
                state.url.includes('school/admin-content-report') ||
                state.url.includes('school/get-help') ||
                state.url.includes('school/class-activity-report')||
                state.url.includes('school/class-performance-report') ||
                state.url.includes('school/user-report') ||
                state.url.includes('school/notification') 


            ) {
                if (this.authService.isUserSignedIn() === true && this.authService.getCurrentUserRole() === 'school') {
                    return true;
                } else {
                    this.route.navigate(['auth/login']);
                    if (!_.isEmpty(this.authService.getCurrentUserRole())) {
                        this.toast.showToast('Not Authorized User!', '', 'error');
                    }
                    return false;
                }
            } else {
                this.toast.showToast('Not Logged In !', '', 'error');
            }
    }
}
