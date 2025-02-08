import { ReadLine, createInterface } from "readline";
import fs from 'fs'
import { execSync } from "child_process";
//🚀
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const f = () => {
  rl.question("$ ", (answer: string) => {
    const args = answer.split(" ");
    const execPath = returnPathOfFileInPath(args[0]);
    if (commands[args[0]]?.isBuiltin && commands[args[0]]?.executable) {
      (commands[args[0]].execute)(args)
      rl.prompt()
    } else if (execPath.length > 0 && !commands[args[0]]?.isBuiltin) {
      const res = execSync(answer)
      rl.write(res.toString())
    } else {
      if (args[0] == 'exit' || args[1] == 'exit') {
        handleExit(answer)
      } else {
        handleOtherArgs(answer)
      }
    }
    f()
  })
};

f()

const commands: Command = {
  echo: {
    name: 'echo',
    printValue: (rl: ReadLine, answer: string) => {
      rl.write(answer)
    },
    execute: (args: string[] = []) => {
      const res = handleQuotes(args)
      rl.write(`${res}\n`)
    },
    executable: true,
    isBuiltin: true
  },
  exit: {
    name: "exit",
    printValue: () => process.exit(),
    isBuiltin: true
  },
  type: {
    name: "type",
    printValue: (rl: ReadLine, answer: string) => {
      rl.write(answer)
    },
    isBuiltin: true
  },
  pwd: {
    name: "pwd",
    printValue: (rl: ReadLine, answer: string) => {
      rl.write(answer)
    },
    execute: () => {
      const v = returnCurrentPath();
      rl.write(`${v}\n`)
    },
    executable: true,
    isBuiltin: true
  },
  cd: {
    name: "cd",
    printValue: (rl: ReadLine, answer: string) => {
      rl.write(answer)
    },
    execute: (args: string[] = []) => {
      try {
        if (args[1] == "~") {
          process.chdir(`${process.env?.HOME}`)
        } else {
          process.chdir(args[1])
        }
      } catch (er) {
        rl.write(`cd: ${args[1]}: No such file or directory\n`)
        rl.prompt()
      }
    },
    executable: true,
    isBuiltin: true
  }
}

const handleQuotes = (args: string[]) => {
  let temp = args
  const a = temp.filter(i => i.length > 0)
  a.shift()
  const k = a.join(' ')
  args.shift()
  const joined = args.join()
  let j = joined
  if (joined.startsWith("'") && joined.endsWith("'")) {
    j = joined.replaceAll(",", " ").substring(1, joined.length - 1).replaceAll("'", "")
  } else if (joined.startsWith('"') && joined.endsWith('"')) {
    const doubleQuotesArr = joined.split('","')
    let res = "" as string
    doubleQuotesArr.map((i: any) => {
      res += i.replaceAll(",", " ").replaceAll('"', " ").trim() + " "
    })
    j = res
  } else {
    j = k
  }
  return j
}
const handleOtherArgs = (answer: string) => {
  const args = answer.split(" ");
  if (args[0] == 'type' && commands[args[1]] && commands[args[1]].isBuiltin) {
    commands[args[1]].printValue(rl, commands[args[1]].name + ' is a shell builtin\n')
  } else if (args[0] == 'type' && !commands[args[1]]) {
    commandIsInPath(args[1])
  } else {
    rl.write(`${answer}: command not found\n`)
  }
}

const handleExit = (answer: string) => {
  if (answer == 'exit 0') {
    commands['exit'].printValue()
  } else if (answer == "type exit") {
    rl.write(`exit is a shell builtin\n`)
  } else if (answer == "echo exit") {
    rl.write(`exit\n`)
  }
}

const returnPathOfFileInPath = (command: string) => {
  let found = false;
  const paths = process.env.PATH?.split(":");
  let commandPath = "";
  paths?.forEach((path) => {
    try {
      const cmds = fs.readdirSync(path).filter((cmd) => cmd === command);
      if (cmds.length > 0) {
        found = true;
        cmds.forEach(() => {
          commandPath = `${path}/${command}`
        });
      }
    } catch (error: any) {
    }
  });
  return commandPath
}

const returnCurrentPath = () => {
  return process.cwd()
}
const commandIsInPath = (command: string) => {
  const path = returnPathOfFileInPath(command)
  if (path.length > 0) {
    rl.write(`${command} is ${path}\n`);
  } else {
    rl.write(`${command}: not found\n`);
  }
}

type Command = {
  [key: string]: {
    name: string,
    printValue: any
    isBuiltin?: boolean
    execute?: any
    executable?: boolean
  }
}
