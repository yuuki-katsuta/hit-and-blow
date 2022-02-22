import { HitAndBlow } from './hitAndBlow';
import { Game } from './Game';
import { Janken } from './janken';
import { printLine } from './print';
import { promptSelect } from './print';

const nextActions = ['play again', 'change game', 'exit'] as const;
type NextAction = typeof nextActions[number];

const gameTitles = ['hit and blow', 'janken'] as const;
type GameTitle = typeof gameTitles[number];

//mapped types ユニオン型がオブジェクトのキーとなる型を生成
type GameStore = {
  // setting,play,endの3つのメソッドを持つことを保証した型なので、Gameに置き換え可能
  [key in GameTitle]: Game;
};

class GameProcedure {
  private currentGameTitle: GameTitle | '' = '';
  private currentGame: Game | null = null;

  //インスタンス化されるときgameStoreプロパティがセットされる.readonlyなどの修飾子があればプロパティに自動セットされる
  constructor(private readonly gameStore: GameStore) {}

  public async start() {
    await this.select();
    await this.play();
  }

  private async select() {
    this.currentGameTitle = await promptSelect<GameTitle>(
      'ゲームのタイトルを入力してください',
      gameTitles
    );
    this.currentGame = this.gameStore[this.currentGameTitle];
  }

  private async play() {
    if (!this.currentGame) throw new Error('ゲームが選択されていません');
    printLine(`===\n${this.currentGameTitle}を開始するよ!\n===`);
    await this.currentGame.setting();
    await this.currentGame.play();
    this.currentGame.end();

    const action = await promptSelect<NextAction>(
      'ゲームを続けますか?',
      nextActions
    );
    if (action === 'play again') await this.play();
    else if (action === 'change game') {
      await this.select();
      await this.play();
    } else if (action === 'exit') this.end();
    else {
      //アクション追加したが条件分岐を忘れていた場合エラー
      const neverValue: never = action;
      throw new Error(`${neverValue} is an invalid action`);
    }
  }

  private end() {
    printLine('ゲームを終了しました!');
    process.exit();
  }
}

(async () => {
  new GameProcedure({
    'hit and blow': new HitAndBlow(),
    janken: new Janken(),
  }).start();
})();
