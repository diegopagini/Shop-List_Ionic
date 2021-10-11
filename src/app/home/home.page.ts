import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../interfaces/item.interface';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public items$: Observable<Item[]>;
  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.items$ = this.shopService.getItems();
    this.shopService.getItems().subscribe(console.log);
  }

  public delete(id): void {
    // this.shopService.deleteItem(id).subscribe();
    this.add({
      id: new Date().getTime().toString(),
      name: 'Hola',
      price: 100,
      quantity: 1,
      checked: false,
    });
  }

  public add(item): void {
    item = {
      id: new Date().getTime().toString(),
      name: 'Hola',
      price: 100,
      quantity: 1,
      checked: false,
    };

    this.shopService.addItem(item);
  }
}
