import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ArchwizardModule } from 'angular-archwizard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { NgbDatepickerModule, NgbModalModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { DetalleOrdenComponent } from './pages/catalogo/detalle-orden/detalle-orden.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ServerErrorsInterceptorService } from './util/server-errors-interceptor.service';
import { AuthInterceptorService } from './util/auth-interceptor.service';

export function tokenGetter() {
  let tk = sessionStorage.getItem(environment.token);
  return tk != null ? tk : '';
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CatalogoComponent,
    DetalleOrdenComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    ToastrModule.forRoot(),
    FlexLayoutModule,
    NgOptionHighlightModule,
    NgMultiSelectDropDownModule,
    NgxPaginationModule,
    NgxDatatableModule,
    ArchwizardModule,
    FontAwesomeModule,
    ToastrModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgSelectModule,
    ScrollingModule,
    NgbModule,
    NgbTooltipModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
