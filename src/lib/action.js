import _ from 'lodash';
import fs from 'fs';
import jsYaml from 'js-yaml';
import sooty from 'sooty';
import setEnvs from 'set-envs';
import log from './log';
import validate from './validate';

export default async function action(cmd, options) {
  const args = await validate(cmd, options);
  const config = await loadConfig(args.config);
  switch (cmd) {
    case 'scrape':
      const results = await sooty(config);
      console.log('results', results);
      return results;
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
