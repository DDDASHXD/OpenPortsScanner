const { showVersion, helpScreen, tag } = require("./helpers.js");
const runScan = require("./scan");

const commands = [
  {
    input: ["-h", "--help"],
    execute: helpScreen,
  },
  {
    input: ["-v", "--version"],
    execute: showVersion,
  },
  {
    input: ["-i", "--ip"],
    execute: (args) => runScan(args),
  },
];

(async () => {
  for (const cmd of commands) {
    const cmdArr = cmd.input;
    const args = process.argv.slice(2);

    for (const v of cmdArr) {
      if (args.includes(v)) {
        await cmd.execute(args);
        process.exit(0);
      }
    }
  }
})();
