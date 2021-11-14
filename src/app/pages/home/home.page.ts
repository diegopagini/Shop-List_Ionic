import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, PopoverController } from '@ionic/angular';
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
  darkMode = false;

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

  delete(item: Item): void {
    this.shopService.deleteItem(item).subscribe();
    this.ionList.closeSlidingItems();
  }

  toggle(): void {
    this.darkMode = !this.darkMode;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.darkMode
      ? document.body.setAttribute('color-theme', 'dark')
      : document.body.setAttribute('color-theme', 'light');
  }

  restart(): void {
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
