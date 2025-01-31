import { ReadLine, createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const f = () => {
  rl.question("$ ", (answer: string) => {
    if (answer == 'exit 0') {
      commands['exit']()
    }

    const args = answer.split(" ");
    if (commands[args[0]]) {
      commands[args[0]](rl, answer.substring(5) + '\n')
    } else {
      rl.write(`${answer}: command not found\n`)
    }
    f()
  })
};

f()

const commands: Command = {
  'echo': (rl: ReadLine, answer: string) => { rl.write(answer) },
  "exit": () => process.exit()
}

//INFO: types
type Command = {
  [key: string]: any
}
