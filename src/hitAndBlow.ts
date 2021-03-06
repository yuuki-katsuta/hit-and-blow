import { Game } from './Game';
import { printLine } from './print-method';
import { promptSelect } from './print-method';
import { promptInput } from './print-method';

// as constにより["nomal", "hard"]型に固定できる。扱う上でstring[]に変換されるのを防ぐ
const modes = ['nomal', 'hard'] as const;
//[]で型を抽出できる。numberキーワードによりすべての中身を取り出せる
type Mode = typeof modes[number];

//implementsで,HitAndBlowクラスはGameの抽象クラスを実装するということ
export class HitAndBlow implements Game {
  //初期値のセットは演算処理がなければ constructorを介す必要はない
  private readonly answerSource = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
  ];
  private answer: string[] = [];
  private tryCount = 0;
  private mode: Mode = 'nomal';

  //３つの数字を決定
  async setting() {
    //包含関係なので型アサーションを活用（返って来たstring型をMode型として扱う）
    this.mode = await promptSelect<Mode>('モードを入力してください', modes);
    const answrLength = this.getAnswerLength();
    while (this.answer.length < answrLength) {
      const num = Math.floor(Math.random() * this.answerSource.length);
      const selectedItem = this.answerSource[num];
      if (!this.answer.includes(selectedItem)) {
        this.answer.push(selectedItem);
      }
    }
  }

  private getAnswerLength() {
    switch (this.mode) {
      case 'nomal':
        return 3;
      case 'hard':
        return 4;
      default:
        //到達不能なコードなのでnever型が推論
        //caseの書き忘れはnever型を活用
        const neverValue: never = this.mode;
        throw new Error(`${neverValue}は無効なモードです...`);
    }
  }

  async play() {
    const answerLength = this.getAnswerLength();
    const inputArr = (
      await promptInput(`[,]区切りで${answerLength}つの数字を入力してください`)
    ).split(',');
    if (!this.validate(inputArr)) {
      printLine('無効な入力です!');
      await this.play();
      return;
    }
    const result = this.check(inputArr);
    if (result.hit === this.answer.length) this.tryCount += 1;
    else {
      printLine(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n---`);
      this.tryCount += 1;
      await this.play();
    }
  }

  //外部からアクセスしているわけではないのでprivate修飾子を付与
  private check(input: string[]) {
    let hitCount = 0;
    let blowCount = 0;

    input.forEach((val, index) => {
      if (val === this.answer[index]) hitCount += 1;
      else if (this.answer.includes(val)) blowCount += 1;
    });
    return {
      hit: hitCount,
      blow: blowCount,
    };
  }

  private validate(inputArr: string[]) {
    const isLengthValid = inputArr.length === this.answer.length;
    //answerSourceに含まれるか
    const isAllAnswerSourceOption = inputArr.every((val) =>
      this.answerSource.includes(val)
    );
    //重複チェック
    const isAllDifferentValues = inputArr.every(
      (val, i) => inputArr.indexOf(val) === i
    );
    return isLengthValid && isAllAnswerSourceOption && isAllDifferentValues;
  }

  end() {
    printLine(`正解です!! \n試行回数: ${this.tryCount}回`);
    //インスタンス内のデータをクリア
    this.reset();
  }

  reset() {
    this.answer = [];
    this.tryCount = 0;
  }
}
