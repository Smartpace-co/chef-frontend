import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScaffoldModule } from '@modules/scaffold/scaffold.module';
import { SchoolComponent } from './school.component';
import { SchoolRoutingModule } from './school-routing.module';
import { ModalComponent } from '@modules/teacher/components/modal/modal.component';
import { DashboardComponent } from '@modules/school/component/dashboard/dashboard.component';
import { SchoolSideBarComponent } from './component/school-side-bar/school-side-bar.component';
import { SchoolHeaderComponent } from './component/school-header/school-header.component';
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
import { DiscussionForumComponent } from './component/discussion-forum/discussion-forum.component';
import { DiscussionForumInnerComponent } from './component/discussion-forum-inner/discussion-forum-inner.component';
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

@NgModule({
  declarations: [
    SchoolComponent,
    ContentSettingsComponent,
    GetHelpComponent,
    ReportHistoryInnerComponent,
    AdminContentReportComponent,
    AdminBillingComponent,
    MembershipDetailsComponent,
    EditMemberShipComponent,
    SchoolSettingsComponent,
    ReportIssueHistoryComponent,
    DiscussionForumInnerComponent,
    DashboardComponent,
    DiscussionForumComponent,
    ReportIssueComponent,
    CommonQuestionsComponent,
    AddStudentComponent,
    SchoolHeaderComponent,
    AdminStudentComponent,
    SchoolSideBarComponent,
    AdminUserRolesComponent,
    AddRolesComponent,
    AdminUsersComponent,
    AddUserComponent,
    UserProfileComponent,
    ImportUserComponent,
    SchoolProfileComponent,
    AdminTeacherComponent,
    AddTeacherComponent,
    AdminClassesComponent,
    ClassDetailsComponent,
    ClassActivityReportComponent,
    ClassPerformanceReportComponent,
    UserReportComponent,
    NotificationComponent
  ],
  entryComponents: [ModalComponent],
  imports: [CommonModule, SchoolRoutingModule, SharedModule, ScaffoldModule, Ng2SearchPipeModule, FormsModule]
})
export class SchoolModule {}
