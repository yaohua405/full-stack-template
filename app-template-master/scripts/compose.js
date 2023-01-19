#!/usr/bin/env node

const fs = require("fs");

const app_dir = fs.realpathSync(process.cwd());

const shell = require("shelljs");
const find = require("find");

const files = process.argv[2] ? [process.argv[2]] : find
  .fileSync(/docker-compose\.yml/, app_dir)
  // To order by dir placement
  .sort((a, b) => b.split("/").length - a.split("/").length);

console.log('Compose files: ', files)
  
const result = shell.exec(
  `docker-compose ${files.map((f) => ` -f  ${f} `).join(" ")} up -d --build`
);

process.exit(result && result.code);
