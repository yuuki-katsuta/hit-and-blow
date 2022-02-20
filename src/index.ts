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

(async () => {
  const name = await promptInput('名前を入力してね!');
  console.log(name);
  const age = await promptInput('年齢を教えてよ〜');
  console.log(age);
  process.exit();
})();
