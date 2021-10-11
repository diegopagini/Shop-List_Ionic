import { HttpClient } from '@angular/common/http';
import { ApplicationRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Item } from '../interfaces/item.interface';

const url: string = environment.firebaseUrl;

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(
    private http: HttpClient,
    private applicationRef: ApplicationRef
  ) {}

  public getItems(): Observable<any> {
    return this.http
      .get(`${url}/shop.json`)
      .pipe(map(this.createArray), delay(1000));
  }

  public addItem(item: Item): Observable<any> {
    return this.http.post(`${url}/shop.json`, item);
  }

  public deleteItem(id: string): Observable<any> {
    this.applicationRef.tick();
    return this.http.delete(`${url}/shop/${id}.json`).pipe(take(1));
  }

  private createArray(shopObject): Item[] {
    const items: Item[] = [];
    if (shopObject === null) {
      return [];
    }
    Object.keys(shopObject).forEach((key) => {
      const item: Item = shopObject[key];
      item.id = key;
      items.push(item);
    });
    return items;
  }
}
