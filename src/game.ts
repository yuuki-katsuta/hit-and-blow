export abstract class Game {
  //抽象メソッド（実装を持たない型だけの存在）
  abstract setting(): Promise<void>;
  abstract play(): Promise<void>;
  abstract end(): void;
}
