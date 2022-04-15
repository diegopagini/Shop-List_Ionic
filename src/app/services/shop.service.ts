import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, switchMap, take, tap } from 'rxjs/operators';
import { Item } from '../models/item.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private total = new BehaviorSubject<number>(0);
  private items = new BehaviorSubject<Item[]>([]);

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private authService: AuthService
  ) {
    this.getItemsFromFirebase();
  }

  getItemsFromFirebase(): void {
    this.http
      .get<Item[]>(`${this.authService.getUserId()}.json`)
      .pipe(
        map(this.createArray),
        tap((items) => {
          let accum = 0;
          items.forEach((item) => {
            accum += item.quantity * item.price;
          });
          this.total.next(accum);
        })
      )
      .subscribe((items: Item[]) => this.items.next(items));
  }

  /**
   * Method to get all items.
   *
   * @returns Observable<Item[]>
   */
  getItems(): Observable<Item[]> {
    return this.items.asObservable();
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
   */
  addItem(item: Item): Observable<Item> {
    return this.http.post(`/${this.authService.getUserId()}.json`, item).pipe(
      finalize(() => {
        this.presentToast(`${item.name} agregado`);
        this.getItemsFromFirebase();
      })
    );
  }

  /**
   * Method to update a item.
   *
   * @param item
   * @returns Observable<Item>
   */
  updateItem(item: Item): Observable<Item> {
    const temporaryItem = {
      ...item,
    };

    return this.http
      .put(`${this.authService.getUserId()}/${item.id}.json`, temporaryItem)
      .pipe(
        tap(() => this.presentToast(`${item.name} actualizado`)),
        finalize(() => this.getItemsFromFirebase())
      );
  }

  /**
   * Method to uncheck all items.
   *
   * @returns Observable<void>
   */
  restartList(): Observable<void> {
    return this.items.asObservable().pipe(
      take(1),
      switchMap((items: Item[]) =>
        items.map((item: Item) => {
          const temp: Item = { ...item, checked: false };
          this.http
            .put(`${this.authService.getUserId()}/${item.id}.json`, temp)
            .subscribe();
        })
      ),
      finalize(() => {
        this.getItemsFromFirebase();
        this.presentToast('Lista reinicializada');
      })
    );
  }

  /**
   * Method to toggle the checked property of a item.
   *
   * @param item
   * @returns Observable<Item>
   */
  toggleCheck(item: Item): Observable<Item> {
    const temporaryItem = JSON.parse(JSON.stringify(item));
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
        finalize(() => {
          this.presentToast(`${item.name} eliminado`);
          this.getItemsFromFirebase();
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
}
