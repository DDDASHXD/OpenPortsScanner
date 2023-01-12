const { version } = require("../package.json");

module.exports.tag = `
 ___________  ______    OpenPortsScanner by 
|  _  | ___ \\/  ___|    @DASHISTRASH and @ROUTERRAGE
| | | | |_/ /\\ \`--.
| | | |  __/  \`--. \\   
\\ \\_/ / |    /\\__/ /    Version:
 \\___/\\_|    \\____/     ${version}
`;

module.exports.helpScreen = () => {
  console.log(this.tag);
  console.log(`Welcome to OpenPortsScanner.
   This tool will help you test if a given IP has any ports open.    
   
   -h, --help              Shows this help menu.
   -v, --version           Shows the current version.
   -i, --ip                Specify IP to test.
   -r, --range             Specify the range to test in.
                             E.G. 1000-2000
                             (Default: 0-9999)
   
   -t, --timeout           Set the timeout for each request(in ms)
                             (Default: 5000)
   
   -S, --secure            Use this if the site or IP uses SSL
   -s, --sleep             Use this to set a timeout for each request.(in ms)
                         Sometimes it's possible to make too many requests,
                         This helps withs spacing them out.
                             (Default: 50)
   
   -o, --output            Specify a file to output to.`);
};

module.exports.showVersion = () =>
  console.log(`OpenPortsScanner version ${version}`);
