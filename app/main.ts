import { ReadLine, createInterface } from "readline";
//🚀
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
const f = () => {
  rl.question("$ ", (answer: string) => {
    if (answer == 'exit 0') {
      commands['exit'].value()
    }

    const args = answer.split(" ");
    if (args[0] == 'type' && commands[args[1]] && commands[args[1]].isBuiltin) {
      if (args[1] != "exit") {
        commands[args[1]].value(rl, commands[args[1]].name + ' is a shell builtin\n')
      } else {
        rl.write(`exit is a shell builtin\n`)
      }
    } else if (args[0] == 'type' && !commands[args[1]]) {
      rl.write(`${args[1]}: not found\n`)
    } else if (commands[args[0]]) {
      commands[args[0]].value(rl, answer.substring(5) + '\n')
    } else {
      rl.write(`${answer}: command not found\n`)
    }
    f()
  })
};

f()

const commands: Command = {
  echo: {
    name: 'echo',
    value: (rl: ReadLine, answer: string) => {
      rl.write(answer)
    },
    isBuiltin: true
  },
  exit: {
    name: "exit",
    value: () => process.exit(),
    isBuiltin: true
  },
  type: {
    name: "type",
    value: (rl: ReadLine, answer: string) => {
      rl.write(answer)
    },
    isBuiltin: true
  }
}

//INFO: types
type Command = {
  [key: string]: {
    name: string,
    value?: any
    isBuiltin?: boolean
  }
}
