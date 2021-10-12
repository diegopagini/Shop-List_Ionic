import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';
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

  public update(id: string): void {}

  public delete(id: string): void {
    this.shopService.deleteItem(id);
    this.ionList.closeSlidingItems();
  }

  private getPrice() {
    // this.shopService
    //   .getItems()
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((items) => {
    //     let accum = 0;
    //     items.forEach((item) => {
    //       accum += item.quantity * item.price;
    //     });
    //     this.total = accum;
    //   });
  }
}
