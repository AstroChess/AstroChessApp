import { NgModule } from "@angular/core";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule } from "@nebular/theme";

@NgModule({
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
    ]
})
export class SharedModule {}