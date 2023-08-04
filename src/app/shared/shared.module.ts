import { NgModule } from '@angular/core';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
} from '@nebular/theme';
import { SpinnerComponent } from './spinner.component';

@NgModule({
  declarations: [
    SpinnerComponent
  ],
  exports: [
    NbButtonModule,
    NbAlertModule,
    NbContextMenuModule,
    NbCardModule,
    NbIconModule,
    NbEvaIconsModule,
    NbListModule,
    NbLayoutModule,
    NbCheckboxModule,
    NbInputModule,
    SpinnerComponent
  ],
})
export class SharedModule {}
