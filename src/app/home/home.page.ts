import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public items$: Observable<Item[]>;
  public total = 0;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private shopService: ShopService, private router: Router) {}

  ngOnInit(): void {
    this.items$ = this.shopService.getItems();

    this.shopService
      .getItems()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(console.log);
  }

  public reload(event) {
    event.target.complete();
  }

  public delete(id): void {
    this.shopService.deleteItem(id).subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
