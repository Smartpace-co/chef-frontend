import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { DistrictComponent } from "./district.component";
import { DistrictAuthGuard } from "./guards/district-auth-guard";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { DistSettingsComponent } from './components/dist-settings/dist-settings.component';
import { MembershipDetailsComponent } from './components/membership-details/membership-details.component';
import { AdminBillingComponent } from './components/admin-billing/admin-billing.component';
import { DistrictProfileComponent } from './components/district-profile/district-profile.component';
import { DistrictSchoolsComponent } from './components/district-schools/district-schools.component';
import { AddSchoolComponent } from './components/add-school/add-school.component';
import { SchoolDetailsComponent } from './components/school-details/school-details.component';
import { SchoolsReportComponent } from './components/schools-report/schools-report.component';
import { AdminClassesComponent } from './components/admin-classes/admin-classes.component';
import { TroubleshootingComponent } from './components/troubleshooting/troubleshooting.component';
import { ClassDetailsComponent } from './components/class-details/class-details.component';
import { CommonQuestionsComponent } from './components/common-questions/common-questions.component';
import { DiscussionForumComponent } from './components/discussion-forum/discussion-forum.component';
import { GetHelpComponent } from './components/get-help/get-help.component';
import { ClassActivityReportComponent } from './components/class-activity-report/class-activity-report.component';
import { ClassPerformanceReportComponent } from './components/class-performance-report/class-performance-report.component';
import { SchoolPerformanceReportComponent } from './components/school-performance-report/school-performance-report.component';
import { ContentSettingsComponent } from './components/content-settings/content-settings.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { DiscussionForumInnerComponent } from './components/discussion-forum-inner/discussion-forum-inner.component';
import { ImportUserComponent } from './components/import-user/import-user.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AddTeacherComponent } from './components/add-teacher/add-teacher.component';
import { AdminTeacherComponent } from './components/admin-teacher/admin-teacher.component';
import { AdminStudentComponent } from './components/admin-student/admin-student.component';
import { AddStudentComponent } from "./components/add-student/add-student.component";
import { AdminUserRolesComponent } from "./components/admin-user-roles/admin-user-roles.component";
import { ReportIssueComponent } from './components/report-issue/report-issue.component';
import { AddRolesComponent } from './components/add-roles/add-roles.component';
import { AdminContentReportComponent } from './components/admin-content-report/admin-content-report.component';
import { UserReportComponent } from './components/user-report/user-report.component';
import{EditMemberShipComponent} from './components/edit-membership/edit-membership.component';
import{ReportHistoryInnerComponent}from './components/report-history-inner/report-history-inner.component'
import{ReportIssueHistoryComponent} from './components/report-issue-history/report-issue-history.component';

const routes: Routes = [
    {
        path: '',
        component: DistrictComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'user-profile',
                component: UserProfileComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'notifications',
                component: NotificationsComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'settings',
                component: DistSettingsComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'membership-details',
                component: MembershipDetailsComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'billing',
                component: AdminBillingComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'district-profile',
                component: DistrictProfileComponent,
                canActivate: [DistrictAuthGuard]
            }
            ,
            {
                path: 'district-schools',
                component: DistrictSchoolsComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'add-schools',
                component: AddSchoolComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'school-details',
                component: SchoolDetailsComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'school-report',
                component: SchoolsReportComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'admin-classes',
                component: AdminClassesComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'troubleshooting',
                component: TroubleshootingComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'class-details',
                component: ClassDetailsComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'common-questions',
                component: CommonQuestionsComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'discussion-forum',
                component: DiscussionForumComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'get-help',
                component: GetHelpComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'class-activity-report',
                component: ClassActivityReportComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'class-performance-report',
                component: ClassPerformanceReportComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'school-performance-report',
                component: SchoolPerformanceReportComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'content-settings',
                component: ContentSettingsComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'add-user',
                component: AddUserComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'discussion-forum-inner',
                component: DiscussionForumInnerComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'import-user',
                component: ImportUserComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'admin-user',
                component: AdminUsersComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'add-teacher',
                component: AddTeacherComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'admin-teacher',
                component: AdminTeacherComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'admin-student',
                component: AdminStudentComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'add-student',
                component: AddStudentComponent,
                canActivate:[DistrictAuthGuard] 
            },
            {
                path: 'admin-users-role',
                component: AdminUserRolesComponent,
                canActivate:[DistrictAuthGuard] 
            },
            {
                path: 'report-issue',
                component: ReportIssueComponent,
                canActivate:[DistrictAuthGuard] 
            }
            ,
            {
                path: 'add-roles',
                component: AddRolesComponent,
                canActivate:[DistrictAuthGuard] 
            }
            ,
            {
                path: 'admin-content-report',
                component: AdminContentReportComponent,
                canActivate:[DistrictAuthGuard] 
            }
            ,
            {
                path: 'user-report',
                component: UserReportComponent,
                canActivate:[DistrictAuthGuard] 
            },
            {
                path: 'edit-membership',
                component: EditMemberShipComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'report-history-inner',
                component: ReportHistoryInnerComponent,
                canActivate: [DistrictAuthGuard]
            },
            {
                path: 'report-issue-history',
                component: ReportIssueHistoryComponent,
                canActivate: [DistrictAuthGuard]
            },
        ]
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DistrictRoutingModule { }
