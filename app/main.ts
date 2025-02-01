import { ReadLine, createInterface } from "readline";
//🚀
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const f = () => {
  rl.question("$ ", (answer: string) => {
    const args = answer.split(" ");

    if (args[0] == 'exit' || args[1] == 'exit') {
      handleExit(answer)
    } else {
      handleOtherArgs(answer)
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

const handleOtherArgs = (answer: string) => {
  const args = answer.split(" ");
  if (args[0] == 'type' && commands[args[1]] && commands[args[1]].isBuiltin) {
    commands[args[1]].value(rl, commands[args[1]].name + ' is a shell builtin\n')
  } else if (args[0] == 'type' && !commands[args[1]]) {
    //WARNING: !!!!
    const p = process.env.PATH2 ?? ""
    const { realRoute, isInPath } = commandIsInPath(args[1], p)
    if (isInPath) {
      rl.write(`${args[1]} is ${realRoute}\n`)
    } else {
      rl.write(`${args[1]}: not found\n`)
    }
  } else if (commands[args[0]]) {
    commands[args[0]].value(rl, answer.substring(5) + '\n')
  } else {
    rl.write(`${answer}: command not found\n`)
  }
}

const handleExit = (answer: string) => {
  if (answer == 'exit 0') {
    commands['exit'].value()
  } else if (answer == "type exit") {
    rl.write(`exit is a shell builtin\n`)
  } else if (answer == "echo exit") {
    rl.write(`exit\n`)
  }
}

const commandIsInPath = (command: string, path: string) => {
  const splited = path.split(':')
  let isInPath = false
  let realRoute = null
  for (const s in splited) {
    const splitedDir = splited[s].split('/')
    for (const d in splitedDir) {
      if (splitedDir[d] == command) {
        realRoute = splited[s]
        isInPath = true
        break
      }
    }
  }
  return { isInPath, realRoute }
}

//INFO: types
type Command = {
  [key: string]: {
    name: string,
    value?: any
    isBuiltin?: boolean
  }
}
