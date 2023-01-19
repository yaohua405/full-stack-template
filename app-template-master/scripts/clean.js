#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const app_dir = fs.realpathSync(process.cwd());

module.exports = (v) => {
  if(!v || ['string','object'].includes(typeof v))v='dist';
  if(typeof v === 'string')v=[v];
  v = v.filter(Boolean)
  v.forEach(f => fs.rmSync(path.resolve(app_dir, f), {recursive: true, force:true}))
}
