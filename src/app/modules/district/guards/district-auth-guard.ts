import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { ToasterService } from '@appcore/services/toaster.service';
import * as _ from 'lodash';

@Injectable()
export class DistrictAuthGuard implements CanActivate {
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
        } else
            if (
                state.url.includes('') ||
                state.url.includes('district/dashboard') ||
                state.url.includes('district/user-profile') ||
                state.url.includes('district/notifications') ||
                state.url.includes('district/settings') ||
                state.url.includes('district/membership-details') ||
                state.url.includes('district/billing') ||
                state.url.includes('district/district-profile') ||
                state.url.includes('district/district-schools') ||
                state.url.includes('district/add-schools') ||
                state.url.includes('district/school-details') ||
                state.url.includes('district/school-report') ||
                state.url.includes('district/admin-classes') ||
                state.url.includes('district/troubleshooting') ||
                state.url.includes('district/class-details') ||
                state.url.includes('district/common-questions') ||
                state.url.includes('district/discussion-forum') ||
                state.url.includes('district/get-help') ||
                state.url.includes('district/class-activity-report') ||
                state.url.includes('district/class-performance-report') ||
                state.url.includes('district/school-performance-report') ||
                state.url.includes('district/content-settings') ||
                state.url.includes('district/add-user') ||
                state.url.includes('district/discussion-forum-inner') ||
                state.url.includes('district/import-user') ||
                state.url.includes('district/admin-user') ||
                state.url.includes('district/add-teacher') ||
                state.url.includes('district/admin-teacher') ||
                state.url.includes('district/admin-student') ||
                state.url.includes('district/add-student') ||
                state.url.includes('district/admin-users-role') ||
                state.url.includes('district/report-issue') ||
                state.url.includes('district/add-roles') ||
                state.url.includes('district/admin-content-report') ||
                state.url.includes('district/user-report') ||
                state.url.includes('district/edit-membership') ||
                state.url.includes('district/report-history-inner') ||
                state.url.includes('district/report-issue-history')
            ) {
                if (this.authService.isUserSignedIn() === true && this.authService.getCurrentUserRole() === 'district') {
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
