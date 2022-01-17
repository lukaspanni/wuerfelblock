import { Category } from './category';
import { Player } from './player';
import { Points } from './points';

describe('Player', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player('TEST');
  });

  it('should create with name', () => {
    expect(player).toBeDefined();
    expect(player.name).toEqual('TEST');
  });

  it('getPoints should return 0 for non-existing category', () => {
    expect(player.getPoints(new Category('', 0))).toBe(0);
    player.setPoints(new Category('test', 10), 10);
    expect(player.getPoints(new Category('', 0))).toBe(0);
  });

  it('setPoints should set to 0 on negative values', () => {
    const category = new Category('test', 10);
    player.setPoints(category, -5);
    expect(player.getPoints(category)).toBe(0);
  });

  it('setPoints should add to points-Map', () => {
    expect((player as any).points.size).toBe(0);

    const category = new Category('test', 10);
    player.setPoints(category, 5);

    expect((player as any).points.size).toBe(1);
    expect(player.getPoints(category)).toBe(5);
  });

  it('setPoints should update points-Map', () => {
    const category = new Category('test', 10);
    player.setPoints(category, 5);
    player.setPoints(category, 10);

    expect((player as any).points.size).toBe(1);
    expect(player.getPoints(category)).toBe(10);
  });

  it('setPoints should throw error if category validation fails', () => {
    const categoryDefaultValidation = new Category('test', 10); // uses default validation
    const categoryCustomValidation = new Category('test2', 10, undefined, undefined, (input: number) => false);
    expect(() => player.setPoints(categoryDefaultValidation, 10)).not.toThrowError();
    expect(() => player.setPoints(categoryDefaultValidation, 11)).toThrowError();
    expect(() => player.setPoints(categoryCustomValidation, 0)).toThrowError();
  });

  it('totalPoints should sum all from points-Map', () => {
    const category = new Category('test', 10);
    const category2 = new Category('test2', 30);
    player.setPoints(category, 5);
    player.setPoints(category2, 10);

    expect((player as any).points.size).toBe(2);
    expect(player.totalPoints).toBe(15);
  });

  it('subTotal should sum all from points-Map included in parameter', () => {
    const category = new Category('test', 10);
    const category2 = new Category('test2', 30);
    const category3 = new Category('test3', 20);
    player.setPoints(category, 5);
    player.setPoints(category2, 10);
    player.setPoints(category3, 20);

    expect(player.totalPoints).toBe(35);
    expect(player.subTotal([category2, category3])).toBe(30);
  });
});
