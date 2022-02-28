import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ScaffoldModule } from '@modules/scaffold/scaffold.module';
import { AuthComponent } from './auth.component';
import { AccessCodeComponent } from './pages/access-code/access-code.component';
import { StudentFreeAccessComponent } from './pages/student-free-access/student-free-access.component';
import { VerifiedComponent } from './pages/verified/verified.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ResetPasswordLinkComponent } from './pages/reset-password-link/reset-password-link.component';
import { PasswordChangedComponent } from './pages/password-changed/password-changed.component';
import { StudentMembershipComponent } from './pages/student-membership/student-membership.component';
import { RegisterAdminComponent } from './pages/register-admin/register-admin.component';
import { SchoolAdminComponent } from './pages/register-school/register-school-admin.component';
import { RegisterTeacherComponent } from './pages/register-teacher/register-teacher.component';
import { EndComponent } from './pages/end/end.component';
import { StudentSignUpComponent } from './pages/student-sign-up/student-sign-up.component';
import { GeneratePasswordComponent } from './pages/generate-password/generate-password.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ForgotPasswordComponent, RegisterAdminComponent, VerifyEmailComponent, AuthComponent, AccessCodeComponent, StudentFreeAccessComponent, VerifiedComponent, SignUpComponent, ResetPasswordComponent, ResetPasswordLinkComponent, PasswordChangedComponent, StudentMembershipComponent,SchoolAdminComponent, RegisterTeacherComponent,EndComponent, StudentSignUpComponent, GeneratePasswordComponent],
  imports: [CommonModule, AuthRoutingModule, SharedModule, FormsModule, ScaffoldModule]
})
export class AuthModule {}
