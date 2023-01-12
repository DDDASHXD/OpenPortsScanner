const { exit } = require('process');
const prompt = require('prompt-sync');
const axios = require('axios');
const fs = require("fs");
const os = require("os")
const cliProgress = require("cli-progress");
const colors = require('ansi-colors');
const { Console } = require('console');

const args = process.argv.slice(2)

// Settings
let help = false;
let ip = false;
let range = "0-1000";
let timeout = 500;
let secure = false;
let sleep = 50;
let output = false;

let working = [];
let failed = [];



const tag = ` ___________  ______ 
|  _  | ___ \\/  ___|
| | | | |_/ /\\ \`--. 
| | | |  __/  \`--. \\
\\ \\_/ / |    /\\__/ /
 \\___/\\_|    \\____/ 
OpenPortsScanner by @DASHISTRASH and @ROUTERRAGE
`

args.forEach((arg, index) => {
    if (arg === "-h" || arg === "--help") {
        help = true;
    }

    if (arg === "-i" || arg === "--ip") {
        ip = args[index + 1];
    }

    if (arg === "-r" || arg === "--range") {
        range = args[index + 1]
    }

    if (arg === "-t" || arg === "--timeout") {
        timeout = Number(args[index + 1])
    }

    if (arg === "-S" || arg === "--secure") {
        secure = true
    }

    if (arg === "-s" || arg === "--sleep") {
        sleep = Number(args[index + 1])
    }

    if (arg === "-o" || arg === "--output") {
        output = args[index + 1];
    }
});

const minRange = Number(range.split("-")[0]);
const maxRange = Number(range.split("-")[1]);

const bar1 = new cliProgress.SingleBar({
    format: 'Progress |' + colors.cyan('{bar}') + '| {percentage}% | {value}/{total} Checked | ' + colors.greenBright('Success: {success}') + ' ' + colors.red('Fail: {fail}') + ' | Current: {current}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
    forceRedraw: true,
});

if (help) {
    console.log(tag)
    console.log("Welcome to OpenPortsScanner.")
    console.log("This tool will help you test if a given IP has any ports open.")
    console.log("")
    console.log("-h, --help            Shows this help menu.")
    console.log("-i, --ip              Specify IP to test.")
    console.log("-r, --range           Specify the range to test in.")
    console.log("                           E.G. 1000-2000")
    console.log("                           (Default: 0-9999)")
    console.log("")
    console.log("-t, --timeout         Set the timeout for each request(in ms)")
    console.log("                           (Default: 500)")
    console.log("")
    console.log("-S, --secure          Use this if the site or IP uses SSL")
    console.log("-s, --sleep           Use this to set a timeout for each request.(in ms)")
    console.log("                      Sometimes it's possible to make too many requests,")
    console.log("                      This helps withs spacing them out.")
    console.log("                           (Default: 50)")
    console.log("")
    console.log("-o, --output          Specify a file to output to.")
    exit()    
}

if (!ip) {
    console.log("You need to specify an IP.")
    exit();
}

const writeFile = () => {
    fs.writeFile(`${output}`, `ip: ${ip}, ${working.toString()}`, err => {
        if (err) {
          console.error(err);
        }
    });
}

const runTest = async ({url, port}) => {
    await axios.get(url, {timeout}).then((res) => {
            if (res.status == 200) {
                working.push(port)
                writeFile();
            }
        }).catch((err) => {
            if (err.code === "ECONNABORTED") {
                failed.push(port);
            }
        })
        bar1.increment({
            success: working.length,
            fail: failed.length,
            current: port,
        });
}

const run = async () => {
    //await axios.get(`http${secure ? "s" : ""}://${ip}`, {timeout: timeout}).then((res) => console.log(res.status)).catch((err) => console.log(err))

    

    console.log(tag)
    console.log(`testing ${maxRange - minRange} ports on IP http${secure ? "s" : ""}://${ip}`)
    if (output) {
        console.log(`Writing output to: ${output}`)
    }
    console.log(``)
    bar1.start(maxRange - minRange, 0, {
        success: working.length,
        fail: failed.length,
        current: "N/A",
    });

    const promises = [];
    for (let i = minRange; i < maxRange; i++) {
        if (i % 10 === 0 && sleep) {
            await new Promise(resolve => setTimeout(resolve, sleep));
        }
        promises.push(runTest({
            url: `http${secure ? "s" : ""}://${ip}:${i}`,
            port: i
        }))
    };
    await Promise.all(promises);

    bar1.stop();
    console.log("")
    console.log("Working ports:")
    console.log(working)
    
}

run();