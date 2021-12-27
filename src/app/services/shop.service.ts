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
  private totalSubjet = new BehaviorSubject<number>(0);
  private total$: Observable<number> = this.totalSubjet.asObservable();
  private subject = new BehaviorSubject<Item[]>([]);
  private items$ = this.subject.asObservable();
  private loadingSubjet = new BehaviorSubject<boolean>(false);
  private loading$ = this.loadingSubjet.asObservable();
  private searchSubject = new BehaviorSubject<string>('');
  private search$ = this.searchSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) {
    this.getItemsFromFirebase();
  }

  getItemsFromFirebase(): void {
    this.loadingSubjet.next(true);

    this.http
      .get<Item[]>(`shop.json`)
      .pipe(
        map(this.createArray),
        tap((items) => {
          let accum = 0;
          items.forEach((item) => {
            accum += item.quantity * item.price;
          });
          this.totalSubjet.next(accum);
        }),
        finalize(() => this.loadingSubjet.next(false))
      )
      .subscribe((items: Item[]) => this.subject.next(items));
  }

  // Get all items
  getItems(): Observable<Item[]> {
    return this.items$;
  }

  // Get loading
  getLoading(): Observable<boolean> {
    return this.loading$;
  }

  // Get Total
  getTotal(): Observable<number> {
    return this.total$;
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

  // Modifique an item
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
    return this.items$.pipe(
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

  // Toggle the checked property of an item
  toggleCheck(item: Item): Observable<Item> {
    const temporaryItem = JSON.parse(JSON.stringify(item));
    return this.http.put(`shop/${item.id}.json`, temporaryItem).pipe(
      tap(() => this.loadingSubjet.next(true)),
      finalize(() => this.loadingSubjet.next(false))
    );
  }

  // Delete an item
  deleteItem(item: Item): Observable<Item> {
    return this.http.delete(`shop/${item.id}.json`).pipe(
      finalize(() => {
        this.presentToast(`${item.name} eliminado`);
        this.getItemsFromFirebase();
      })
    );
  }

  searchItem(search: string): void {
    console.log(search);

    if (search) {
      this.searchSubject.next(search);
    }
  }

  getSearch(): Observable<string> {
    return this.search$;
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
