import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from 'src/app/models/item.interface';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
  @Input() item: Item;
  @Output() itemChange = new EventEmitter<Item>();

  constructor(private shopService: ShopService) {}

  onClick(item: Item): void {
    const checked = {
      ...item,
      checked: !item.checked,
    };
    this.itemChange.emit(checked);
    this.shopService.toggleCheck(checked).subscribe();
  }
}
