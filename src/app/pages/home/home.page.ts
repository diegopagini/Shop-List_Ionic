import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, PopoverController } from '@ionic/angular';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Item } from '../../interfaces/item.interface';
import { ShopService } from '../../services/shop.service';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('list') ionList: IonList;

  constructor(
    public shopService: ShopService,
    private popoverController: PopoverController
  ) {}

  ngOnInit(): void {
    this.shopService.getItems();
  }

  async presentModal(item: Item): Promise<void> {
    const popover = await this.popoverController.create({
      component: ModalPage,
      translucent: true,
      componentProps: {
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        id: item.id,
        checked: item.checked,
      },
    });
    this.ionList.closeSlidingItems();
    return await popover.present();
  }

  async delete(id: string): Promise<void> {
    await this.shopService.deleteItem(id);
    this.ionList.closeSlidingItems();
  }

  restart() {
    this.shopService.items$.subscribe((items: Item[]) => {
      items.forEach((item: Item) => {
        const uncheckedItem = {
          ...item,
          checked: false,
        };
        this.shopService.toggleCheck(uncheckedItem);
      });
    });
  }
}
