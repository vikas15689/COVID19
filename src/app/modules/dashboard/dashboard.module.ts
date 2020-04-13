import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NbIconModule, NbCardModule, NbListModule, NbSpinnerModule, NbSelectModule } from '@nebular/theme';
import { DashboardService } from './dashboard.service';
import { OrderByPipe } from 'src/app/pipes/order-by.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NbIconModule,
    NbCardModule,
    NbListModule,
    PipesModule,
    NbSpinnerModule,
    NbSelectModule
  ], providers: [DashboardService]
})
export class DashboardModule { }
