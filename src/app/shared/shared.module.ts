import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './components/button/button.component';
import { SelectComponent } from './components/select/select.component';
import { InputFieldComponent } from './components/input-field/input-field/input-field.component';
import { DragNDropInputComponent } from './components/drag-n-drop-input/drag-n-drop-input.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DropDownComponent } from './components/drop-down/drop-down.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TablesComponent } from './components/tables/tables.component';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';
import { NgbDropdownModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SortByPipe } from '@shared/pipes/sort-by.pipe';
import { RadioComponent } from './components/radio/radio.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MultiSelectDropdownComponent } from './components/multi-select-dropdown/multi-select-dropdown.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { InfocardComponent } from './components/infocard/infocard.component';
import { VjsPlayerComponent } from './components/vjs-player/vjs-player.component';
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel.component';
import { CheckoutPageComponent } from './components/checkout-page/checkout-page.component';


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    ButtonComponent,
    SelectComponent,
    DragNDropInputComponent,
    InputFieldComponent,
    DropDownComponent,
    TabsComponent,
    TablesComponent,
    ToggleButtonComponent,
    SortByPipe,
    RadioComponent,
    MultiSelectDropdownComponent,
    InfocardComponent,
    VjsPlayerComponent,
    PaymentSuccessComponent,
    PaymentCancelComponent,
    CheckoutPageComponent,

  ],

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbModule,
    FontAwesomeModule,
    Ng2SearchPipeModule,
    SlickCarouselModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxStripeModule.forRoot('pk_test_51J2qQTLnyrqVEiSe5LUumXNARXUbszlstNit2HsGbPr2rRtJPSttDyGHEOt4yIU4M14e2KRz3f1Oa53sNhDOyMTv00Hun3pjbK'),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    ButtonComponent,
    SelectComponent,
    InputFieldComponent,
    RadioComponent,
    DragNDropInputComponent,
    DropDownComponent,
    TabsComponent,
    TablesComponent,
    ToggleButtonComponent,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule,
    FontAwesomeModule,
    SlickCarouselModule,
    MultiSelectDropdownComponent,
    VjsPlayerComponent
  ],
  providers: [SortByPipe,
  ]
})
export class SharedModule { }
