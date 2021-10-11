import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonList } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Item } from '../interfaces/item.interface';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('list') ionList: IonList;
  public items$: Observable<Item[]>;
  public total = 0;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private shopService: ShopService, private router: Router) {}

  ngOnInit(): void {
    this.items$ = this.shopService.getItems();
    this.getPrice();
  }

  public async reload(event) {
    this.items$ = await this.shopService.getItems();
    event.target.complete();
  }

  public async delete(id) {
    this.shopService.deleteItem(id).subscribe();
    this.items$ = await this.shopService.getItems();
    this.ionList.closeSlidingItems();
  }

  public receiveModifiedItems(items) {
    this.items$ = items;
    this.getPrice();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getPrice() {
    this.shopService
      .getItems()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((items) => {
        let accum = 0;
        items.forEach((item) => {
          accum += item.quantity * item.price;
        });
        this.total = accum;
      });
  }
}
