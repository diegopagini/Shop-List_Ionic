import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Output() itemsEmitter: EventEmitter<any> = new EventEmitter<any>();
  public addForm: FormGroup;

  constructor(private fb: FormBuilder, private shopService: ShopService) {}

  ngOnInit() {
    this.initializeForm();
  }

  public async addProduct() {
    if (this.addForm.valid) {
      await this.shopService.addItem(this.addForm.value).subscribe();
      await this.shopService.getItems().subscribe();
      const items$ = await this.shopService.getItems();
      this.initializeForm();

      this.itemsEmitter.emit(items$);
    }
  }

  private initializeForm(): void {
    this.addForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      quantity: [1, [Validators.required]],
      id: [new Date().getTime().toString()],
      checked: [false],
    });
  }
}
