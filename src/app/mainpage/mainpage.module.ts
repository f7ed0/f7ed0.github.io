import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainpageComponent } from './mainpage.component';
import { MainpageRoutingModule } from './mainpage-routing.module';
import { HeaderModule } from '../header/header.module';
import { XpItemComponent } from './xp-item/xp-item.component';
import { ToolsComponent } from './tools/tools.component';
import { MatGridListModule } from '@angular/material/grid-list'



@NgModule({
  declarations: [
    MainpageComponent,
    XpItemComponent,
    ToolsComponent
  ],
  imports: [
    CommonModule,
    MainpageRoutingModule,
    HeaderModule,
    MatGridListModule
  ]
})
export class MainpageModule { }
