#!/usr/bin/env node

import 'babel-polyfill';
import commander from 'commander';
import action from '../lib/action';
import error from '../lib/error';
import { version } from '../package';

let isAction = false;

commander.version(version);
commander.option('-r --root [path]', 'root path');
commander.option('-c --config [path]', 'config path');
commander.option('-o --output [path]', 'output path');
commander.command('run');
commander.action((cmd, options) => {
  isAction = true;
  action(cmd, options).catch(error);
});
commander.parse(process.argv);

if (!isAction) {
  action('run', {}).catch(error);
}
