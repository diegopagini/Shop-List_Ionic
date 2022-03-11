import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, switchMap, take, tap } from 'rxjs/operators';
import { Item } from '../models/item.interface';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private total = new BehaviorSubject<number>(0);
  private items = new BehaviorSubject<Item[]>([]);

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) {
    this.getItemsFromFirebase();
  }

  getItemsFromFirebase(): void {
    this.http
      .get<Item[]>(`shop.json`)
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

  // Get all items
  getItems(): Observable<Item[]> {
    return this.items.asObservable();
  }

  // Get Total
  getTotal(): Observable<number> {
    return this.total.asObservable();
  }

  // Add a new item
  addItem(item: Item): Observable<Item> {
    return this.http.post(`/shop.json`, item).pipe(
      finalize(() => {
        this.presentToast(`${item.name} agregado`);
        this.getItemsFromFirebase();
      })
    );
  }

  // Modifique a item
  updateItem(item: Item): Observable<Item> {
    const temporaryItem = {
      ...item,
    };

    return this.http.put(`shop/${item.id}.json`, temporaryItem).pipe(
      tap(() => this.presentToast(`${item.name} actualizado`)),
      finalize(() => this.getItemsFromFirebase())
    );
  }

  // Restart checked items
  restartList(): Observable<void> {
    return this.items.asObservable().pipe(
      take(1),
      switchMap((items: Item[]) =>
        items.map((item: Item) => {
          const temp: Item = { ...item, checked: false };
          this.http.put(`shop/${item.id}.json`, temp).subscribe();
        })
      ),
      finalize(() => {
        this.getItemsFromFirebase();
        this.presentToast('Lista reinicializada');
      })
    );
  }

  // Toggle the checked property of a item
  toggleCheck(item: Item): Observable<Item> {
    const temporaryItem = JSON.parse(JSON.stringify(item));
    return this.http.put(`shop/${item.id}.json`, temporaryItem);
  }

  // Delete a item
  deleteItem(item: Item): Observable<Item> {
    return this.http.delete(`shop/${item.id}.json`).pipe(
      finalize(() => {
        this.presentToast(`${item.name} eliminado`);
        this.getItemsFromFirebase();
      })
    );
  }

  // Method to show a toast
  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      duration: 1500,
    });
    toast.present();
  }

  // Metohd to create an array from the object
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
