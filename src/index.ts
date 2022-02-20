const printLine = (text: string, breakLine: boolean = true) => {
  process.stdout.write(text + (breakLine ? '\n' : ''));
};

const promptInput = async (text: string) => {
  printLine(`\n${text}\n>`, false);
  //標準入力を1回だけ受け取る
  const input: string = await new Promise((resolve) =>
    process.stdin.once('data', (data) => resolve(data.toString()))
  );
  return input.trim();
};

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

  //３つの数字を決定
  setting() {
    const answrLength = 3;
    while (this.answer.length < answrLength) {
      const num = Math.floor(Math.random() * this.answerSource.length);
      const selectedItem = this.answerSource[num];
      if (!this.answer.includes(selectedItem)) {
        this.answer.push(selectedItem);
      }
    }
  }

  async play() {
    const inputArr = (
      await promptInput('[,]区切りで3つの数字を入力してください')
    ).split(',');
    if (!this.validate(inputArr)) {
      printLine('無効な入力です!');
      await this.play();
      return;
    }
    const result = this.check(inputArr);
    if (result.hit === this.answer.length) this.tryCount += 1;
    else {
      printLine(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n---}`);
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
    process.exit();
  }
}

(async () => {
  // const name = await promptInput('名前を入力してね!');
  // console.log(name);
  // const age = await promptInput('年齢を教えてよ〜');
  // console.log(age);
  // process.exit();
  const hitandblow = new HitAndBlow();
  hitandblow.setting();
  await hitandblow.play();
  hitandblow.end();
})();
