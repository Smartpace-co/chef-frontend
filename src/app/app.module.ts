import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from '@appcore/interceptor/header.interceptor';
import { HttpErrorInterceptor } from '../app/http-error.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslationService } from '@appcore/services/translation.service';
import { FormsModule } from '@angular/forms';
import { ComingSoonComponent } from './modules/coming-soon/coming-soon.component';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScaffoldModule } from '@modules/scaffold/scaffold.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DataTablesModule } from 'angular-datatables';
import { StudentAuthGuard } from '@modules/student/guards/student-auth-guard';
import { TeacherAuthGuard } from '@modules/teacher/guards/teacher-auth-guard';
import { DistrictAuthGuard } from '@modules/district/guards/district-auth-guard';
import { SchoolAuthGuard } from '@modules/school/guards/school-auth-guard';
import { Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from '@modules/auth/services/auth.service';


export function HttpLoaderFactory(httpClient: HttpClient) {
  if (environment.production){
    return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
    }else{
    return new TranslateHttpLoader(httpClient);
  }
}

@NgModule({
  declarations: [AppComponent, ComingSoonComponent],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DataTablesModule.forRoot(),
    BrowserAnimationsModule,
    ScaffoldModule,
    NgbModule,
    Ng2SearchPipeModule,
 
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [TranslationService, AuthService, TeacherAuthGuard, StudentAuthGuard, DistrictAuthGuard, SchoolAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule]
})
export class AppModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    /**
     * To load each component at scroll top (0,0).
     */
    router.events.pipe(
      filter((e: any): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e.position) {
        // backward navigation
        viewportScroller.scrollToPosition(e.position);
      } else if (e.anchor) {
        // anchor navigation
        viewportScroller.scrollToAnchor(e.anchor);
      } else {
        // forward navigation
        viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }
}
