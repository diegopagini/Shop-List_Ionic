import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';

import { ModalPageRoutingModule } from './modal-routing.module';
import { ModalPage } from './modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [ModalPage],
})
export class ModalPageModule {}
