import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';
import { Item } from '../interfaces/item.interface';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('list') ionList: IonList;

  constructor(public shopService: ShopService) {}

  ngOnInit(): void {
    this.shopService.getItems();
  }

  public async update(item: Item): Promise<void> {
    await this.shopService.updateItem(item);
    this.ionList.closeSlidingItems();
  }

  public async delete(id: string): Promise<void> {
    await this.shopService.deleteItem(id);
    this.ionList.closeSlidingItems();
  }
}
