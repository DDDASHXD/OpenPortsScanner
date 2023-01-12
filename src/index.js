const { exit } = require('process');
const prompt = require('prompt-sync');
const axios = require('axios');
const fs = require("fs");
const os = require("os")
const cliProgress = require("cli-progress");
const colors = require('ansi-colors');
const { Console } = require('console');
const pjson = require("../package.json");

const args = process.argv.slice(2)

// Settings
let help = false;
let ip = false;
let range = "0-9999";
let timeout = 5000;
let secure = false;
let sleep = 50;
let output = false;
let showVersion = false;

let version = pjson.version

let working = [];
let failed = [];



const tag = `
 ___________  ______    OpenPortsScanner by 
|  _  | ___ \\/  ___|    @DASHISTRASH and @ROUTERRAGE
| | | | |_/ /\\ \`--.
| | | |  __/  \`--. \\   
\\ \\_/ / |    /\\__/ /    Version:
 \\___/\\_|    \\____/     ${version}
`

args.forEach((arg, index) => {
    if (arg === "-h" || arg === "--help") {
        help = true;
    }

    if (arg === "-v" || arg === "--version") {
        showVersion = true;
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

if (showVersion) {
    console.log(`OpenPortsScanner version ${version}`)
    exit();
}

if (!ip && !help) {
    console.log(`${colors.bgRed(colors.black("ERROR:"))} ${colors.red("You need to specify an ip.")}`)
    help = true;
}

if (help) {
    console.log(tag)
    console.log(`Welcome to OpenPortsScanner.
This tool will help you test if a given IP has any ports open.    

-h, --help              Shows this help menu.
-v, --version           Shows the current version.
-i, --ip                Specify IP to test.
-r, --range             Specify the range to test in.
                            E.G. 1000-2000
                            (Default: ${range})

-t, --timeout           Set the timeout for each request(in ms)
                            (Default: ${timeout})

-S, --secure            Use this if the site or IP uses SSL
-s, --sleep             Use this to set a timeout for each request.(in ms)
                        Sometimes it's possible to make too many requests,
                        This helps withs spacing them out.
                            (Default: ${sleep})

-o, --output            Specify a file to output to.`)
    exit()    
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