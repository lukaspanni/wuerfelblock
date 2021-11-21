import { Component, Input } from '@angular/core';
import { Category } from 'src/app/model/category';
import { Player } from 'src/app/model/player';

@Component({
  selector: 'wb-category-display',
  templateUrl: './category-display.component.html',
  styleUrls: ['./category-display.component.scss'],
})
export class CategoryDisplayComponent {
  @Input() categories: Category[];
  @Input() players: Player[];
  @Input() columnWidth: number;

  constructor() {}

  public showInputField(category: Category): boolean {
    return (
      category.maxPoints !== undefined && category.fixedPoints === undefined
    );
  }

  public showCheckbox(category: Category): boolean {
    return category.fixedPoints !== undefined;
  }
}
