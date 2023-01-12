const axios = require("axios");
const fs = require("fs-extra");
const { tag } = require("./helpers.js");
const colors = require("ansi-colors");
const cliProgress = require("cli-progress");

const progress = new cliProgress.SingleBar({
  format:
    "Progress |" +
    colors.cyan("{bar}") +
    "| {percentage}% | {value}/{total} Checked | " +
    colors.greenBright("Success: {success}") +
    " " +
    colors.red("Fail: {fail}") +
    " | Current: {current}",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
  forceRedraw: true,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const writeToFile = async (data, ip, path) => {
  const writableData = `IP: ${ip}
    
${data}`;
  await fs.writeFile(path, writableData);
};

const runScan = async (args) => {
  try {
    console.log(tag);

    const results = {
      working: [],
      failed: [],
    };
    const values = parseArguments(args);

    const minRange = Number(values.range.split("-")[0]);
    const maxRange = Number(values.range.split("-")[1]);

    const baseUrl = (secure, ip, index) => {
      const protocol = secure ? "https" : "http";
      const idx = index ? `:${index}` : "";
      return `${protocol}://${ip}${idx}`;
    };

    console.log(
      `testing ${maxRange - minRange} ports on IP ${baseUrl(
        values.secure,
        values.ip
      )}\n`
    );
    if (values.output) {
      console.log(`Writing output to: ${values.output}\n`);
    }

    progress.start(maxRange - minRange, 0, {
      success: results["working"].length,
      fail: results["failed"].length,
      current: "N/A",
    });

    const promises = [];
    for (let i = minRange; i < maxRange; i++) {
      if (i % 50 === 0 && values.sleep) {
        await new Promise((resolve) => setTimeout(resolve, values.sleep));
      }

      const result = runTest({
        url: baseUrl(values.secure, values.ip, i),
        port: i,
        timeout: values.timeout,
      }).then((success) => {
        progress.increment({
          success: results["working"].length,
          fail: results["failed"].length,
          current: i,
        });
        if (success) {
          return results.working.push(i);
        }
        results.failed.push(i);
      });
      promises.push(result);
    }
    await Promise.all(promises);

    if (values.output) {
      await writeToFile(results.working.join(", "), values.ip, values.output);
    }

    progress.stop();
    console.log(`Working ports: ${results.working.join(", ")}`);
  } catch (e) {
    console.log(e);
  }
};

const runTest = async ({ url, port, timeout }) => {
  try {
    const res = await axios.get(url, { timeout });
    if (res.status === 200) return true;

    return false;
  } catch (e) {
    return false;
  }
};

const parseArguments = (args) => {
  const initialValues = {
    help: false,
    ip: "",
    range: "0-9999",
    timeout: 5000,
    secure: false,
    sleep: 50,
    output: "",
    showVersion: false,
  };

  args.forEach((arg, index) => {
    if (arg === "-h" || arg === "--help") {
      initialValues.help = true;
    }

    if (arg === "-v" || arg === "--version") {
      initialValues.showVersion = true;
    }

    if (arg === "-i" || arg === "--ip") {
      initialValues.ip = args[index + 1];
    }

    if (arg === "-r" || arg === "--range") {
      initialValues.range = args[index + 1];
    }

    if (arg === "-t" || arg === "--timeout") {
      initialValues.timeout = Number(args[index + 1]);
    }

    if (arg === "-S" || arg === "--secure") {
      initialValues.secure = true;
    }

    if (arg === "-s" || arg === "--sleep") {
      initialValues.sleep = Number(args[index + 1]);
    }

    if (arg === "-o" || arg === "--output") {
      initialValues.output = args[index + 1];
    }
  });

  return initialValues;
};

module.exports = runScan;
