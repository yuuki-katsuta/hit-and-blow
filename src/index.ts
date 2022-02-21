const printLine = (text: string, breakLine: boolean = true) => {
  process.stdout.write(text + (breakLine ? '\n' : ''));
};

//ユーザーの入力値を返す
const readLine = async () => {
  const input: string = await new Promise((resolve) =>
    process.stdin.once('data', (data) => resolve(data.toString()))
  );
  return input.trim();
};

//Tがstring型と包含関係にあることを証明している
const promptSelect = async <T extends string>(
  text: string,
  values: readonly T[]
): Promise<T> => {
  printLine(`\n${text}`);
  //選択肢を出力
  values.forEach((value) => {
    printLine(`- ${value}`);
  });
  printLine(`> `, false);

  //再帰的に関数を呼び出し再入力を促す
  const input = (await readLine()) as T;
  if (values.includes(input)) return input;
  else return promptSelect<T>(text, values);
};

const promptInput = async (text: string) => {
  printLine(`\n${text}\n>`, false);
  return await readLine();
};

const nextActions = ['play again', 'change game', 'exit'] as const;
type NextAction = typeof nextActions[number];

type GameStore = {
  'hit and blow': HitAndBlow;
  janken: Janken;
};

const gameTitles = ['hit and blow', 'janken'] as const;
type GameTitle = typeof gameTitles[number];

class GameProcedure {
  private currentGameTitle: GameTitle | '' = '';
  private currentGame: HitAndBlow | Janken | null = null;

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

// as constにより["nomal", "hard"]型に固定できる。扱う上でstring[]に変換されるのを防ぐ
const modes = ['nomal', 'hard'] as const;
//[]で型を抽出できる。numberキーワードによりすべての中身を取り出せる
type Mode = typeof modes[number];

class HitAndBlow {
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

const jankenOptions = ['rock', 'paper', 'scissors'] as const;
type JankenOption = typeof jankenOptions[number];

class Janken {
  private rounds = 0;
  private currentRound = 1;
  private result = {
    win: 0,
    lose: 0,
    draw: 0,
  };

  async setting() {
    const rounds = Number(await promptInput('何本勝負にしますか？'));
    if (Number.isInteger(rounds) && 0 < rounds) {
      this.rounds = rounds;
    } else {
      await this.setting();
    }
  }

  async play() {
    const userSelected = await promptSelect(
      `【${this.currentRound}回戦】選択肢を入力してください。`,
      jankenOptions
    );
    const randomSelected = jankenOptions[Math.floor(Math.random() * 3)];
    const result = Janken.judge(userSelected, randomSelected);
    let resultText: string;

    switch (result) {
      case 'win':
        this.result.win += 1;
        resultText = '勝ち';
        break;
      case 'lose':
        this.result.lose += 1;
        resultText = '負け';
        break;
      case 'draw':
        this.result.draw += 1;
        resultText = 'あいこ';
        break;
    }
    printLine(
      `---\nあなた: ${userSelected}\n相手${randomSelected}\n${resultText}\n---`
    );

    if (this.currentRound < this.rounds) {
      this.currentRound += 1;
      await this.play();
    }
  }

  end() {
    printLine(
      `\n${this.result.win}勝${this.result.lose}敗${this.result.draw}引き分けでした。`
    );
    this.reset();
  }

  private reset() {
    this.rounds = 0;
    this.currentRound = 1;
    this.result = {
      win: 0,
      lose: 0,
      draw: 0,
    };
  }

  static judge(userSelected: JankenOption, randomSelected: JankenOption) {
    if (userSelected === 'rock') {
      if (randomSelected === 'rock') return 'draw';
      if (randomSelected === 'paper') return 'lose';
      return 'win';
    } else if (userSelected === 'paper') {
      if (randomSelected === 'rock') return 'win';
      if (randomSelected === 'paper') return 'draw';
      return 'lose';
    } else {
      if (randomSelected === 'rock') return 'lose';
      if (randomSelected === 'paper') return 'win';
      return 'draw';
    }
  }
}

(async () => {
  new GameProcedure({
    'hit and blow': new HitAndBlow(),
    janken: new Janken(),
  }).start();
})();
