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
    if (commands[args[0]]?.isBuiltin && commands[args[0]]?.exutable) {
      (commands[args[0]].execute)()
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
  },
  pwd: {
    name: "pwd",
    value: (rl: ReadLine, answer: string) => {
      rl.write(answer)
    },
    execute: () => {
      const v = returnCurrentPath();
      rl.write(`${v}\n`)
    },
    exutable: true,
    isBuiltin: true
  }

}

const handleOtherArgs = (answer: string) => {
  const args = answer.split(" ");
  if (args[0] == 'type' && commands[args[1]] && commands[args[1]].isBuiltin) {
    commands[args[1]].value(rl, commands[args[1]].name + ' is a shell builtin\n')
  } else if (args[0] == 'type' && !commands[args[1]]) {
    commandIsInPath(args[1])
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
    value: any
    isBuiltin?: boolean
    execute?: any
    exutable?: boolean
  }
}
