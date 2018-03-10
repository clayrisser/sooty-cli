import _ from 'lodash';
import commander from 'commander';
import fs from 'fs-extra';
import joi from 'joi';
import jsYaml from 'js-yaml';
import setEnvs from 'set-envs';
import sooty from 'sooty';
import log from './log';
import validate from './validate';
import { isValid } from 'easy-joi';

export default async function action(cmd, options) {
  const args = await validate(cmd, options);
  const config = await loadConfig(args.config);
  switch (cmd) {
    case 'run':
      log.info('scraping data . . .');
      const results = await sooty(config);
      if (args.output) {
        await outputResults(args.output, results);
        log.info(`results saved to ${args.output}`);
      } else {
        log.info('results', results);
      }
      return results;
    default:
      return commander.help();
  }
}

async function loadConfig(configPath) {
  const configString = await new Promise((resolve, reject) => {
    fs.readFile(configPath, (err, data) => {
      if (err) return reject(err);
      return resolve(setEnvs(data.toString()));
    });
  });
  return jsYaml.safeLoad(configString);
}

async function outputResults(resultsPath, results) {
  let format = (resultsPath.match(/\.[^\.\/\\]+$/g) || []).join('').substr(1);
  if (format === 'yaml') format = 'yml';
  if (!await isValid(format, joi.string().valid('json', 'yml'))) {
    format = 'yml';
  }
  let resultsString = '';
  switch (format) {
    case 'json':
      resultsString = JSON.stringify(results, null, 2);
      break;
    default:
      resultsString = jsYaml.dump(results);
      break;
  }
  await fs.mkdirs((resultsPath.match(/.+(?=\/)/g) || []).join(''));
  await fs.writeFile(resultsPath, resultsString);
}
