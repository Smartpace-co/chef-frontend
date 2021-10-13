import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScaffoldModule } from '@modules/scaffold/scaffold.module';
import { DistrictComponent } from './district.component';
import { DistrictRoutingModule } from './district-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ModalComponent } from '@modules/teacher/components/modal/modal.component';
import { DistrictHeaderComponent } from './components/district-header/district-header.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { DistrictSideBarComponent } from './components/district-side-bar/district-side-bar.component';
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
import { AddTeacherComponent } from './components/add-teacher/add-teacher.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminTeacherComponent } from './components/admin-teacher/admin-teacher.component';
import { AdminStudentComponent } from './components/admin-student/admin-student.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { AdminUserRolesComponent } from './components/admin-user-roles/admin-user-roles.component';
import  {ReportIssueComponent} from './components/report-issue/report-issue.component'
import { AddRolesComponent } from './components/add-roles/add-roles.component';
import { AdminContentReportComponent } from './components/admin-content-report/admin-content-report.component';
import { UserReportComponent } from './components/user-report/user-report.component';
import{EditMemberShipComponent} from './components/edit-membership/edit-membership.component'
import{ReportIssueHistoryComponent} from './components/report-issue-history/report-issue-history.component';
import{ReportHistoryInnerComponent}from './components/report-history-inner/report-history-inner.component'

@NgModule({
  declarations: [DistrictComponent, DashboardComponent,ReportIssueHistoryComponent, ReportHistoryInnerComponent,DistrictHeaderComponent,EditMemberShipComponent, UserProfileComponent, DistrictSideBarComponent, NotificationsComponent, DistSettingsComponent, MembershipDetailsComponent, AdminBillingComponent, DistrictProfileComponent, DistrictSchoolsComponent, AddSchoolComponent, SchoolDetailsComponent, SchoolsReportComponent, AdminClassesComponent, TroubleshootingComponent, ClassDetailsComponent, CommonQuestionsComponent, DiscussionForumComponent, GetHelpComponent, ClassActivityReportComponent, ClassPerformanceReportComponent, SchoolPerformanceReportComponent, ContentSettingsComponent, AddUserComponent, DiscussionForumInnerComponent, ImportUserComponent, AddTeacherComponent, AdminUsersComponent, AdminTeacherComponent, AdminStudentComponent, AddStudentComponent, AdminUserRolesComponent, ReportIssueComponent, AddRolesComponent, AdminContentReportComponent, UserReportComponent],
  entryComponents: [ModalComponent],
  imports: [
    CommonModule,
    DistrictRoutingModule,
    SharedModule, ScaffoldModule, Ng2SearchPipeModule, FormsModule
  ]
})
export class DistrictModule { }
