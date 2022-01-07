import { AfterViewInit, Component, Input } from '@angular/core';
import { IonCheckbox, IonInput } from '@ionic/angular';
import { Category } from 'src/app/model/category';
import { Player } from 'src/app/model/player';

enum CheckBoxState {
  unchecked = 0,
  checked = 1,
  indeterminate = 2
}

@Component({
  selector: 'wb-category-display',
  templateUrl: './category-display.component.html',
  styleUrls: ['./category-display.component.scss']
})
export class CategoryDisplayComponent implements AfterViewInit {
  @Input() categories: Category[];
  @Input() players: Player[];
  @Input() columnWidth: number;

  public checkBoxStateMap: Map<Player, Map<string, CheckBoxState>> = new Map();

  private readonly categorySkipClassname = 'category-skip';

  constructor() {}

  public ngAfterViewInit(): void {
    const fixedPointCategories = this.categories.filter((category) => category.fixedPoints !== undefined);
    if (fixedPointCategories.length < 1) return;

    this.players.forEach((player) => {
      this.checkBoxStateMap.set(
        player,
        new Map(fixedPointCategories.map((category) => [category.description, CheckBoxState.unchecked]))
      );
    });
  }

  public getPoints(player: Player, category: Category): number {
    return player.getPoints(category);
  }

  public setPoints(player: Player, category: Category, eventTarget: EventTarget): void {
    const input = eventTarget as unknown as IonInput;
    const points = Number(input.value);

    if (!category.inputValidation(points) || (input.value as string).length === 0) {
      input.value = ' ';
      return;
    }
    if (input.value === '') {
      player.setPoints(category, undefined);
      return;
    }
    player.setPoints(category, points);
  }

  public showInputField(category: Category): boolean {
    return category.maxPoints !== undefined && category.fixedPoints === undefined;
  }

  public showCheckbox(category: Category): boolean {
    return category.fixedPoints !== undefined;
  }

  public checkboxClicked(player: Player, category: Category, event: Event): void {
    if (category.fixedPoints == undefined) return;

    const state = this.checkboxState(player, category);

    event.preventDefault();
    if (state === CheckBoxState.unchecked) {
      player.setPoints(category, category.fixedPoints);
      this.setCheckboxState(player, category, CheckBoxState.checked);
    } else {
      player.setPoints(category, 0);
      if (state === CheckBoxState.checked) this.setCheckboxState(player, category, CheckBoxState.indeterminate);
      else this.setCheckboxState(player, category, CheckBoxState.unchecked);
    }
  }

  public indeterminateState(player: Player, category: Category): boolean {
    return this.checkboxState(player, category) === CheckBoxState.indeterminate;
  }

  private checkboxState(player: Player, category: Category): CheckBoxState {
    const categoryStates = this.checkBoxStateMap.get(player);
    const state = categoryStates?.get(category.description);
    return state ?? CheckBoxState.unchecked;
  }

  private setCheckboxState(player: Player, category: Category, state: CheckBoxState): void {
    const categoryStates = this.checkBoxStateMap.get(player);
    categoryStates?.set(category.description, state);
  }
}
