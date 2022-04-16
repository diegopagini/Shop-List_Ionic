import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, take, tap } from 'rxjs/operators';
import { Item } from '../models/item.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private total = new BehaviorSubject<number>(0);
  private items$ = new BehaviorSubject<Item[]>([]);

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  getItemsFromFirebase(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.authService.getUserId()}.json`).pipe(
      map(this.createArray),
      tap((items) => {
        this.items$.next(items);
        this.getCurrentTotal(items);
      })
    );
  }

  /**
   * Method to get all items.
   *
   * @returns Observable<Item[]>
   */
  getItems(): Observable<Item[]> {
    return this.items$.asObservable().pipe(
      map((items: Item[]) =>
        items.sort((a, b) => ('' + a.name).localeCompare(b.name))
      ),
      tap((items: []) => this.getCurrentTotal(items))
    );
  }

  getItemsValue(): Item[] {
    return this.items$.value.sort((a, b) =>
      ('' + a.name).localeCompare(b.name)
    );
  }

  /**
   * Method to get total.
   *
   * @returns Observable<number>
   */
  getTotal(): Observable<number> {
    return this.total.asObservable();
  }

  /**
   * Metod to add a new item.
   *
   * @param item
   * @returns Observable<Item>
   *
   */
  addItem(item: Item): Observable<Item> {
    return this.http.post(`/${this.authService.getUserId()}.json`, item).pipe(
      tap(() => {
        this.presentToast(`${item.name} agregado`);
        const products = this.getItemsValue();
        products.push(item);
        this.items$.next(products);
      })
    );
  }

  /**
   * Method to update a item.
   *
   * @param item
   * @returns Observable<Item>
   *
   */
  updateItem(item: Item): Observable<Item> {
    const temporaryItem = {
      ...item,
    };
    const products = this.getItemsValue();
    const index = products.findIndex((el) => el.id === item.id);
    products[index] = temporaryItem;
    this.items$.next(products);

    return this.http
      .put(`${this.authService.getUserId()}/${item.id}.json`, temporaryItem)
      .pipe(
        tap(() => {
          this.presentToast(`${item.name} actualizado`);
        })
      );
  }

  /**
   * Method to uncheck all items.
   *
   * @returns Observable<void>
   *
   */
  restartList(): Observable<any> {
    return this.items$.asObservable().pipe(
      take(1),
      tap((items: Item[]) => {
        const products = items.map((item: Item) => {
          const temp: Item = { ...item, checked: false };
          this.http
            .put(`${this.authService.getUserId()}/${item.id}.json`, temp)
            .subscribe();

          return temp;
        });

        this.items$.next(products);
      }),
      finalize(() => {
        this.presentToast('Lista reinicializada');
      })
    );
  }

  /**
   * Method to toggle the checked property of a item.
   *
   * @param item
   * @returns Observable<Item>
   *
   */
  toggleCheck(item: Item): Observable<Item> {
    const temporaryItem = JSON.parse(JSON.stringify(item));
    const products = this.getItemsValue();
    const index = products.findIndex((el) => el.id === item.id);
    products[index] = temporaryItem;
    this.items$.next(products);
    return this.http.put(
      `${this.authService.getUserId()}/${item.id}.json`,
      temporaryItem
    );
  }

  /**
   * Method to toggle the delete a item.
   *
   * @param item
   * @returns Observable<Item>
   */

  deleteItem(item: Item): Observable<Item> {
    return this.http
      .delete(`${this.authService.getUserId()}/${item.id}.json`)
      .pipe(
        tap(() => {
          let products = this.getItemsValue();
          products = products.filter((product) => product.id !== item.id);
          this.items$.next(products);
          this.presentToast(`${item.name} eliminado`);
        })
      );
  }

  /**
   * Method to show a toast.
   *
   * @param message
   * @returns Promise<void>
   */
  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      duration: 1500,
    });
    toast.present();
  }

  /**
   * Metohd to create an array from the object.
   *
   * @param shopObject
   * @returns Item[]
   */
  private createArray(shopObject): Item[] {
    const items: Item[] = [];
    if (shopObject === null) {
      return [];
    } else {
      Object.keys(shopObject).forEach((key) => {
        const item: Item = shopObject[key];
        item.id = key;
        items.push(item);
      });
    }
    // Sort ascending by string
    items.sort((a, b) => ('' + a.name).localeCompare(b.name));
    return items;
  }

  private getCurrentTotal(items: Item[]): void {
    let accum = 0;
    items.forEach((item) => {
      accum += item.quantity * item.price;
    });
    this.total.next(accum);
  }
}
