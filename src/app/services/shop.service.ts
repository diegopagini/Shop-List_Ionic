import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Item } from '../interfaces/item.interface';

const url: string = environment.firebaseUrl;

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  public items$: Observable<Item[]>;
  public total = 0;

  constructor(private http: HttpClient) {}

  public getItems(): void {
    this.items$ = this.http.get<Item[]>(`${url}/shop.json`).pipe(
      map(this.createArray),
      tap((items) => {
        let accum = 0;
        items.forEach((item) => {
          accum += item.quantity * item.price;
        });
        this.total = accum;
      })
    );
  }

  public addItem(item: Item): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${url}/shop.json`, item)
        .pipe(take(1))
        .subscribe((resp: any) => {
          this.getItems();
          resolve(true);
        });
    });
  }

  public deleteItem(id: string) {
    this.http
      .delete(`${url}/shop/${id}.json`)
      .pipe(take(1))
      .subscribe(() => {
        this.getItems();
      });
  }

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
    return items;
  }
}
