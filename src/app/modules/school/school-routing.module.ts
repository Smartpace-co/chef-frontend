import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchoolComponent } from './school.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { SchoolAuthGuard } from './guards/school-auth-guard';
import { AdminUserRolesComponent } from './component/admin-user-roles/admin-user-roles.component';
import { AddRolesComponent } from './component/add-roles/add-roles.component';
import { AdminUsersComponent } from './component/admin-users/admin-users.component';
import { AddUserComponent } from './component/add-user/add-user.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { ImportUserComponent } from './component/import-user/import-user.component';
import { SchoolProfileComponent } from './component/school-profile/school-profile.component';
import { AdminTeacherComponent } from './component/admin-teacher/admin-teacher.component';
import { AddTeacherComponent } from './component/add-teacher/add-teacher.component';
import { AdminClassesComponent } from './component/admin-classes/admin-classes.component';
import { ClassDetailsComponent } from './component/class-details/class-details.component';
import { AdminStudentComponent } from './component/admin-student/admin-student.component';
import { AddStudentComponent } from './component/add-student/add-student.component';
import { CommonQuestionsComponent } from './component/common-questions/common-questions.component';
import { ReportIssueComponent } from './component/report-issue/report-issue.component';
import { ContentSettingsComponent } from './component/content-settings/content-settings.component';
import { SchoolSettingsComponent } from './component/school-settings/school-settings.component';
import { DiscussionForumInnerComponent } from './component/discussion-forum-inner/discussion-forum-inner.component';
import { DiscussionForumComponent } from './component/discussion-forum/discussion-forum.component';
import { ReportIssueHistoryComponent } from './component/report-issue-history/report-issue-history.component';
import { MembershipDetailsComponent } from './component/membership-details/membership-details.component';
import { EditMemberShipComponent } from './component/edit-membership/edit-membership.component';
import { AdminBillingComponent } from './component/admin-billing/admin-billing.component';
import { ReportHistoryInnerComponent } from './component/report-history-inner/report-history-inner.component';
import { AdminContentReportComponent } from './component/admin-content-report/admin-content-report.component';
import { GetHelpComponent } from './component/get-help/get-help.component';
import { ClassActivityReportComponent } from './component/class-activity-report/class-activity-report.component';
import { ClassPerformanceReportComponent } from './component/class-performance-report/class-performance-report.component';
import { UserReportComponent } from './component/user-report/user-report.component';
import { NotificationComponent } from './component/notification/notification.component';

const routes: Routes = [
  {
    path: '',
    component: SchoolComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'admin-users-role',
        component: AdminUserRolesComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'add-roles',
        component: AddRolesComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'admin-user',
        component: AdminUsersComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'add-user',
        component: AddUserComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'import-user',
        component: ImportUserComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'school-profile',
        component: SchoolProfileComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'admin-teacher',
        component: AdminTeacherComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'add-teacher',
        component: AddTeacherComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'admin-classes',
        component: AdminClassesComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'class-details',
        component: ClassDetailsComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'admin-student',
        component: AdminStudentComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'add-student',
        component: AddStudentComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'common-questions',
        component: CommonQuestionsComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'report-issue',
        component: ReportIssueComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'content-settings',
        component: ContentSettingsComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'school-settings',
        component: SchoolSettingsComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'discussion-forum',
        component: DiscussionForumComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'discussion-forum-inner',
        component: DiscussionForumInnerComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'report-issue-history',
        component: ReportIssueHistoryComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'membership-details',
        component: MembershipDetailsComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'edit-membership',
        component: EditMemberShipComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'billing',
        component: AdminBillingComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'report-history-inner',
        component: ReportHistoryInnerComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'admin-content-report',
        component: AdminContentReportComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'get-help',
        component: GetHelpComponent,
        canActivate: [SchoolAuthGuard]
      },
      {
        path: 'class-activity-report',
        component: ClassActivityReportComponent,
        canActivate: [SchoolAuthGuard]
    },
    {
      path: 'class-performance-report',
      component: ClassPerformanceReportComponent,
      canActivate: [SchoolAuthGuard]
  },
  {
    path: 'user-report',
    component: UserReportComponent,
    canActivate:[SchoolAuthGuard] 
},
{
  path: 'notification',
  component: NotificationComponent,
  canActivate:[SchoolAuthGuard] 
},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule {}
