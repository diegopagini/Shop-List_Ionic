import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, finalize, map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Item } from '../interfaces/item.interface';

const url: string = environment.firebaseUrl;

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  items$: Observable<Item[]>;
  loading$: Observable<boolean>;
  total = 0;

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) {}

  // Get all items
  getItems(): void {
    this.loading$ = of(true);

    this.items$ = this.http.get<Item[]>(`${url}/shop.json`).pipe(
      map(this.createArray),
      tap((items) => {
        let accum = 0;
        items.forEach((item) => {
          accum += item.quantity * item.price;
        });
        this.total = accum;
      }),
      finalize(() => (this.loading$ = of(false))),
      catchError((err) => {
        this.presentToast('Error getting items');
        console.log('Error:', err);
        return throwError(err);
      })
    );
  }

  // Add a new item
  addItem(item: Item): Observable<Item> {
    return this.http.post(`${url}/shop.json`, item).pipe(
      tap(() => {
        this.presentToast(`${item.name} agregado`);
        this.getItems();
      }),
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  // Modifique an item
  updateItem(item: Item): Observable<Item> {
    const temporaryItem = {
      ...item,
    };

    return this.http.put(`${url}/shop/${item.id}.json`, temporaryItem).pipe(
      tap(() => {
        this.presentToast(`${item.name} actualizado`);
        this.getItems();
      }),
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  // Toggle the checked property of an item
  toggleCheck(item: Item): Observable<Item> {
    const temporaryItem = JSON.parse(JSON.stringify(item));
    return this.http.put(`${url}/shop/${item.id}.json`, temporaryItem);
  }

  // Delete an item
  deleteItem(item: Item): Observable<Item> {
    return this.http.delete(`${url}/shop/${item.id}.json`).pipe(
      take(1),
      tap(() => {
        this.presentToast(`${item.name} eliminado`);
        this.getItems();
      }),
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
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

  // Method to show a toast
  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      duration: 1500,
    });
    toast.present();
  }
}
