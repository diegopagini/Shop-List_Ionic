import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent } from './form/form.component';
import { ItemComponent } from './item/item.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [ItemComponent, FormComponent, SpinnerComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [ItemComponent, FormComponent, SpinnerComponent],
})
export class ComponentsModule {}
