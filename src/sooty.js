import commander from 'commander';
import action from './action';
import error from './error';
import { version } from '../package.json';

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
