import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccessCodeComponent } from './pages/access-code/access-code.component';
import { StudentFreeAccessComponent } from './pages/student-free-access/student-free-access.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { VerifiedComponent } from './pages/verified/verified.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ResetPasswordLinkComponent } from './pages/reset-password-link/reset-password-link.component';
import { PasswordChangedComponent } from './pages/password-changed/password-changed.component';
import { StudentMembershipComponent } from './pages/student-membership/student-membership.component';
import { RegisterAdminComponent } from './pages/register-admin/register-admin.component';
import { EndComponent } from './pages/end/end.component';
import { StudentSignUpComponent } from './pages/student-sign-up/student-sign-up.component';
import { SchoolAdminComponent } from './pages/register-school/register-school-admin.component';
import { RegisterTeacherComponent } from './pages/register-teacher/register-teacher.component';
import { GeneratePasswordComponent } from './pages/generate-password/generate-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent,

      },
      {
        path: 'register-teacher',
        component: RegisterTeacherComponent,

      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'access-code',
        component: AccessCodeComponent,
      },
      {
        path: 'student-free-access',
        component: StudentFreeAccessComponent,
      },
      {
        path: 'verify-email',
        component: VerifyEmailComponent,
      },
      {
        path: 'email-verified',
        component: VerifiedComponent,
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
      {
        path: 'generate-password',
        component: GeneratePasswordComponent,
      },      
      {
        path: 'reset-password-link',
        component: ResetPasswordLinkComponent,
      },
      {
        path: 'password-changed',
        component: PasswordChangedComponent,
      },
      {
        path: 'student-membership',
        component: StudentMembershipComponent,
      },
      {
        path: 'register-admin',
        component: RegisterAdminComponent,
      },
      {
        path: 'start-again',
        component: EndComponent,
      },
      {
        path: 'student-signup',
        component: StudentSignUpComponent,
      },
      {
        path: 'register-school',
        component: SchoolAdminComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
