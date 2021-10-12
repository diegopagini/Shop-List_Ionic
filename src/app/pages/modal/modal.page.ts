import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Item } from 'src/app/interfaces/item.interface';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() name: string;
  @Input() price: number;
  @Input() quantity: number;
  @Input() id: string;
  @Input() checked: boolean;
  public itemToModify: Item = {};

  constructor(
    private shopService: ShopService,
    private popOverController: PopoverController
  ) {}

  ngOnInit() {
    this.itemToModify = {
      name: this.name,
      price: this.price,
      quantity: this.quantity,
      id: this.id,
      checked: this.checked,
    };
  }

  public async updateItem(): Promise<void> {
    await this.shopService.updateItem(this.itemToModify);
    this.popOverController.dismiss();
  }
}