# OpenPortsScanner (OPS)
```
 _____                 ______          _   _____                                 
|  _  |                | ___ \        | | /  ___|                                
| | | |_ __   ___ _ __ | |_/ /__  _ __| |_\ `--.  ___ __ _ _ __  _ __   ___ _ __ 
| | | | '_ \ / _ \ '_ \|  __/ _ \| '__| __|`--. \/ __/ _` | '_ \| '_ \ / _ \ '__|
\ \_/ / |_) |  __/ | | | | | (_) | |  | |_/\__/ / (_| (_| | | | | | | |  __/ |   
 \___/| .__/ \___|_| |_\_|  \___/|_|   \__\____/ \___\__,_|_| |_|_| |_|\___|_|   
      | |                                                                        
      |_|                                                                        
A CLI tool by @DASHISTRASH and @ROUTERRAGE

```
OpenPortsScanner (OPS) is a CLI tool that tests all open ports on a given IP. It is open-source and incredibly powerful, making it an excellent addition to your OSINT toolbox.

## Features

* 🧑‍🤝‍🧑 **Open-Source**: OPS is an open-source project, meaning it is free to use and modify, and anyone can contribute to the project.
* 🚀 **Powerful**: OPS is incredibly powerful, allowing users to quickly check for open ports on a given IP address.
* 💪 **Flexible**: OPS has many options for customizing the port scan, including a range of ports to check for, a timeout for determining if a port is open or closed, and the ability to output results to a file.

## Drawbacks
Currently, OPS only supports scanning for open HTTP/HTTPS ports. In the future, it'll be able to scan for all open TCP and UDP ports on a given IP.

## How to Use

Using OpenPortsScanner (OPS) is easy and straightforward. To get the help screen, use:

`>ops -h`

To scan an IP with all the default settings, use:

`>ops -i 1.2.3.4`

To specify a range of ports to check for, use:

`>ops -i 1.2.3.4 -r 1000-3000`

To output the working ports to a file, use:

`>ops -i 1.2.3.4 -o ./test.txt`

To specify a timeout (after how long it determines that the port isn't working in milliseconds), use:

`>ops -i 1.2.3.4 -t 5000`

## All arguments
| Argument        | Type    | Description                                                                                                                                       | Default value |
|-----------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| -i or --ip      | String  | Specify the ip to scan on.                                                                                                                        | null          |
| -h or --help    | Boolean | Show the available arguments.                                                                                                                     | false         |
| -v or --version | Boolean | Show the current version.                                                                                                                         | false         |
| -r or --range   | String  | Determine the range of ports to scan for.                                                                                                         | 0-9999        |
| -t or --timeout | Number  | Determine how long it should take before giving up on a<br>port(in ms) and determine that it doesn't work.                                        | 5000          |
| -S or --secure  | Boolean | Check for ports using HTTPS instead of HTTP.                                                                                                      | false         |
| -s or --sleep   | Number  | Determine how long the program should wait before trying<br>a new port(in ms). If you're not getting any results,<br>please try to increase this. | 50            |
| -o or --output  | String  | Set the output file for the working ports, if none is set<br>it just displays the working ports in the console.                                   | null          |

## Make OPS global

If you want to use OPS anywhere on your system, you need to add it to your systems global path.
Here's how to do it on Windows and Linux:

### Windows
_Coming soon!_

### Linux
On linux, you need to have root access to move move the executable to the global path folder.

1. `CD` to the download location
2. use the command `$sudo mv ./ops-linux /usr/bin/ops`
3. use the command `$sudo chmod +x /usr/bin/ops`

This moves `ops-linux` to `/usr/bin`, renames it to `ops` and changes the permissions to allow it to run. After restarting the terminal you should be able to run `ops` anywhere.

## Made with ❤️ by @dashistrash

OpenPortsScanner (OPS) is made with love by [@dashistrash](https://github.com/dashistrash).
