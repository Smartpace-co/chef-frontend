import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRoutingModule } from './teacher-routing.module';

import { AddStudentComponent } from './components/add-student/add-student.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScaffoldModule } from '@modules/scaffold/scaffold.module';
import { TeacherComponent } from './teacher.component';
import { ImportStudentComponent } from './components/import-student/import-student.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { UpcomingAssignmentComponent } from './components/upcoming-assignment/upcoming-assignment.component';
import { TeacherHeaderComponent } from './components/teacher-header/teacher-header.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { ClassInfoComponent } from './components/class-info/class-info.component';
import { ModalComponent } from './components/modal/modal.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TeacherSettingComponent } from './components/teacher-setting/teacher-setting.component';

import { ExploreLessonsListComponent } from './components/explore-lessons-list/explore-lessons-list.component';
import { ExploreLessonsSidebarComponent } from './components/explore-lessons-sidebar/explore-lessons-sidebar.component';
import { ExploreLessonsSettingsComponent } from './components/explore-lessons-settings/explore-lessons-settings.component';

import { TeacherProfileComponent } from './components/teacher-profile/teacher-profile.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

import { TeacherInstructionsComponent } from './components/teacher-instructions/teacher-instructions.component';
import { TeacherBookmarkComponent } from './components/teacher-bookmark/teacher-bookmark.component';
import { CurrentMembershipPlanComponent } from './components/current-membership-plan/current-membership-plan.component';
import { OrderIngredientsComponent } from './components/order-ingredients/order-ingredients.component';

import { RosterGroupTabsComponent } from './components/roster-group-tabs/roster-group-tabs.component';
import { ArchivedClassesComponent } from './components/archived-classes/archived-classes.component';
import { RosterAssignmentDetailsComponent } from './components/roster-assignment-details/roster-assignment-details.component';
import { TeacherPerformanceComponent } from './components/teacher-performance/teacher-performance.component';

import{ AdminBillingComponent } from './components/admin-billing/admin-billing.component'
import{MembershipDetailsComponent} from './components/membership-details/membership-details.component'
import{EditMemberShipComponent} from './components/edit-membership/edit-membership.component'
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { LessonPreviewModule } from './components/lesson-preview/lesson-preview.module';
import { DiscussionForumComponent } from './components/discussion-forum/discussion-forum.component';
import { DiscussionForumInnerComponent } from './components/discussion-forum-inner/discussion-forum-inner.component';

import { ExploreAllLessonComponent } from './components/explore-all-lesson/explore-all-lesson.component';
import { LessonStandardListComponent } from './components/lesson-standard-list/lesson-standard-list.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { GetHelpComponent } from './components/get-help/get-help.component';



@NgModule({

  declarations: [
  
    AddStudentComponent,
    TeacherComponent,
    StudentsListComponent,
    UpcomingAssignmentComponent,
    ImportStudentComponent,
    TeacherHeaderComponent,
    ClassInfoComponent,
    ModalComponent,
    DashboardComponent,
    AdminBillingComponent,
    TeacherSettingComponent,
  
    ExploreLessonsListComponent,
    ExploreLessonsSidebarComponent,
    ExploreLessonsSettingsComponent,
 
    TeacherProfileComponent,
    UserProfileComponent,
    
    TeacherInstructionsComponent,
    TeacherBookmarkComponent,
    CurrentMembershipPlanComponent,
    OrderIngredientsComponent,
    
    RosterGroupTabsComponent,
    ArchivedClassesComponent,
    RosterAssignmentDetailsComponent,
    TeacherPerformanceComponent,
   
    DiscussionForumComponent,
    MembershipDetailsComponent,
    EditMemberShipComponent,
    DiscussionForumInnerComponent,

    ExploreAllLessonComponent,
    LessonStandardListComponent,
    NotificationsComponent,
    GetHelpComponent,
    
  ],
  entryComponents: [ModalComponent],
  imports: [CommonModule, TeacherRoutingModule, SharedModule,LessonPreviewModule, ScaffoldModule, 
    Ng2SearchPipeModule, FormsModule, SelectDropDownModule],
})
export class TeacherModule {}
