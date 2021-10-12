import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ItemComponent } from './item/item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [ItemComponent, FormComponent, SpinnerComponent],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [ItemComponent, FormComponent, SpinnerComponent],
})
export class ComponentsModule {}
