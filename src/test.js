var net = require("net");

//Connect to localhost:80
var socket = net.createConnection("93.105.52.246:21");

if (socket._connecting === true) {
  console.log("The TCP connection is not established yet");
}
