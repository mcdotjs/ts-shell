import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const f = () => {
  rl.question("$ ", (answer: string) => {
    if (answer == "exit 0") {
      process.exit()
    }
    rl.write(`${answer}: command not found\n`)
    f()
  })
};

f()
