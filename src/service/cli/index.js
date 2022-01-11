'use strict';

const version = require(`./version`);
const help = require(`./help`);
const filldb = require(`./filldb`);
const server = require(`./server`);
const fill = require(`./fill`);

const Cli = {
  [version.name]: version,
  [help.name]: help,
  [filldb.name]: filldb,
  [server.name]: server,
  [fill.name]: fill
};

module.exports = {
  Cli,
};

