export const printLine = (text: string, breakLine: boolean = true) => {
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
export const promptSelect = async <T extends string>(
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

export const promptInput = async (text: string) => {
  printLine(`\n${text}\n>`, false);
  return await readLine();
};
