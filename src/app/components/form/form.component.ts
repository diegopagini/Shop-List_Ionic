import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @ViewChild('input', { read: ElementRef }) myInput: ElementRef;
  addForm: FormGroup;
  showForm = false;

  constructor(private fb: FormBuilder, private shopService: ShopService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  addProduct(): void {
    this.showForm = false;
    if (this.addForm.valid) {
      this.shopService.addItem(this.addForm.value).subscribe();
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      quantity: [1, [Validators.required]],
      place: [null],
      id: [new Date().getTime().toString()],
      checked: [false],
    });
  }
}
