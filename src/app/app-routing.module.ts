import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentAuthGuard } from '@modules/student/guards/student-auth-guard';
import { TeacherAuthGuard } from '@modules/teacher/guards/teacher-auth-guard';
import { ComingSoonComponent } from '@modules/coming-soon/coming-soon.component';
import { DistrictAuthGuard } from '@modules/district/guards/district-auth-guard';
import{SchoolAuthGuard} from '@modules/school/guards/school-auth-guard'
import { PaymentSuccessComponent } from '@shared/components/payment-success/payment-success.component';
import { PaymentCancelComponent } from '@shared/components/payment-cancel/payment-cancel.component';
import { CheckoutPageComponent } from '@shared/components/checkout-page/checkout-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/scaffold/scaffold.module').then((m) => m.ScaffoldModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'teacher',
    loadChildren: () => import('./modules/teacher/teacher.module').then((m) => m.TeacherModule),
    canActivate: [TeacherAuthGuard]
  },
  {
    path: 'student',
    loadChildren: () => import('./modules/student/student.module').then((m) => m.StudentModule),
    canActivate: [StudentAuthGuard]
  },
  {
    path: 'district',
    loadChildren: () => import('./modules/district/district.module').then((m) => m.DistrictModule),
    canActivate:[DistrictAuthGuard]
  },
  {
    path: 'school',
    loadChildren: () => import('./modules/school/school.module').then((m) => m.SchoolModule),
    canActivate:[SchoolAuthGuard]
  },
  {
    path: 'coming-soon',
    component: ComingSoonComponent,
    canActivate: [StudentAuthGuard,TeacherAuthGuard]
  },
  {
    path:'paymentSuccess',
    component:PaymentSuccessComponent,
    canActivate:[]
  },
  {
    path:'paymentCancel',
    component:PaymentCancelComponent,
    canActivate:[]
  },
  {
    path:'checkout',
    component:CheckoutPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
