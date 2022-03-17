import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonList, PopoverController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../../models/item.interface';
import { ShopService } from '../../services/shop.service';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('list') ionList: IonList;
  @ViewChild('input', { read: ElementRef }) myInput: ElementRef;
  darkMode = false;
  items$: Observable<Item[]>;
  total$: Observable<number>;
  currentToltal$: Observable<number> = of(0);
  current$: Observable<number>;
  search: string;

  constructor(
    public shopService: ShopService,
    private popoverController: PopoverController,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.items$ = this.shopService.getItems();
    this.total$ = this.shopService.getTotal();
    this.getCurrentTotal();
  }

  onSearch(search: string): void {
    if (search) {
      this.items$ = this.items$.pipe(
        map((items: Item[]) =>
          items.filter((el: Item) =>
            el.name.toLowerCase().includes(search.toLowerCase())
          )
        )
      );
    } else {
      this.items$ = this.shopService.getItems();
    }
  }

  onItemChange(product: Item): void {
    this.getCurrentTotal(product);
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
      ? this.document.body.setAttribute('color-theme', 'dark')
      : this.document.body.setAttribute('color-theme', 'light');
  }

  restart(): void {
    this.shopService.restartList().subscribe();
  }

  private getCurrentTotal(product: Item = { checked: false }): void {
    this.currentToltal$ = this.shopService.getItems().pipe(
      map((items: Item[]) => {
        let arr: Item[] = [];
        if (product.checked) {
          arr = [...items.filter((el) => el.checked), product];
        } else {
          arr = items.filter((el) => el.checked);
        }
        return arr
          .map((el) => el.price * el.quantity)
          .reduce((prev, curr) => prev + curr, 0);
      })
    );
  }
}
