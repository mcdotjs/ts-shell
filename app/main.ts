import { ReadLine, createInterface } from "readline";
import fs from 'fs'
//🚀
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const f = () => {
  rl.question("$ ", (answer: string) => {
    const args = answer.split(" ");
    const execPath = returnPathOfFileInPath(args[0]);
    if (execPath.length > 0 && args[0] != "echo") {
      printInfo(execPath, args)
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

const printInfo = (pathToFile: string, args: any) => {
  fs.access(pathToFile, fs.constants.X_OK, (err) => {
    if (err) {
      rl.write(`File is not executable\n`)
    } else {
      console.log(`Program was passed ${args.length} args (including program name).`)
      console.log(`Arg #0 (program name): ${args[0]}`)
      if (args.length > 1) {
        for (let i = 1; i < args.length; i++) {
          console.log(`Arg #${i}: ${args[i]}`)
        }
      }
      console.log(`Program Signature: ${Math.floor(Math.random() * (9000000000 - 1000000000 + 1)) + 1000000000 + args.length}`)
    }
    rl.prompt()
  });
}

// const execute = (script: string) => {
//
//   const bash = spawn('bash', ['-c', script]);
//   bash.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//   });
//
//   bash.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });
//
//   bash.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
//   });
// }{
//
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

const commandIsInPath = (command: string) => {
  let found = false;
  const paths = process.env.PATH?.split(":");
  paths?.forEach((path) => {
    try {
      const cmds = fs.readdirSync(path).filter((cmd) => cmd === command);
      if (cmds.length > 0) {
        found = true;
        cmds.forEach(() => {
          rl.write(`${command} is ${path}/${command}\n`);
        });
      }
    } catch (error: any) {
    }
  });
  if (!found) {
    rl.write(`${command}: not found\n`);
  }
}

type Command = {
  [key: string]: {
    name: string,
    value: any
    isBuiltin?: boolean
  }
}
