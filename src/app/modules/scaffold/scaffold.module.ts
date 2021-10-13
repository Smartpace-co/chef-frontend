import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScaffoldRoutingModule } from './scaffold-routing.module';
import { ScaffoldComponent } from './containers/scaffold/scaffold.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { StudentHeaderComponent } from './components/header/student-header/student-header.component';


@NgModule({
  declarations: [ScaffoldComponent, SidebarComponent, StudentHeaderComponent],
  imports: [RouterModule, CommonModule, ScaffoldRoutingModule, SharedModule],
  exports: [ScaffoldComponent, StudentHeaderComponent]
})
export class ScaffoldModule {}
