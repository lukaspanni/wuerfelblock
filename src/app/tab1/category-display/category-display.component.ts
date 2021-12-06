import { Component, Input } from '@angular/core';
import { IonCheckbox, IonInput } from '@ionic/angular';
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

  public getPoints(player: Player, category: Category): number {
    return player.getPoints(category);
  }

  public setPoints(
    player: Player,
    category: Category,
    eventTarget: EventTarget
  ): void {
    const input = eventTarget as unknown as IonInput;
    const points = Number(input.value);
    if (!category.inputValidation(points)) {
      input.value = '';
      return;
    }
    player.setPoints(category, points);
  }

  public showInputField(category: Category): boolean {
    return (
      category.maxPoints !== undefined && category.fixedPoints === undefined
    );
  }

  public showCheckbox(category: Category): boolean {
    return category.fixedPoints !== undefined;
  }

  public checkboxClicked(
    player: Player,
    category: Category,
    target: EventTarget
  ) {
    if (category.fixedPoints == undefined) {
      return;
    } //TODO: maybe throw error
    const input = target as unknown as IonCheckbox;
    if (!input.checked) {
      player.setPoints(category, category.fixedPoints);
    } else {
      player.setPoints(category, 0);
    }
  }
}
