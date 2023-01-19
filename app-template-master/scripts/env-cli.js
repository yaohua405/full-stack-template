#!/usr/bin/env node
const shell = require("shelljs");

let args = process.argv.slice(2);
let modes=[];
while(args[0] && args[0][0] === "-"){
  modes.push(args[0].slice(1));
  args = args.slice(1);
}

require("./env")(modes);
const result = shell.exec(args.join(" "));
process.exit(result && result.code);
