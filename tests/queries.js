import { createServer } from 'http-server';
import silentcp from 'easycp';

const config = {
  port: 8080
};

let server = null;

beforeAll(async () => {
  server = createServer();
  await new Promise((resolve, reject) => {
    server.server.on('error', err => {
      if (err.errno !== 'EADDRINUSE') {
        return reject(err);
      }
      // eslint-disable-next-line no-console
      console.warn(`server already running at ${config.port}`);
      return resolve();
    });
    server.listen(8080, err => {
      if (err) return reject(err);
      // eslint-disable-next-line no-console
      console.log(`listening on port ${config.port}`);
      return resolve();
    });
  });
});

afterAll(() => {
  server.close();
});

describe('queries', () => {
  it('should scrape data from website', async () => {
    await silentcp(
      'babel-node -- src/bin/sooty -r tests -c queries.yml -o ../.tmp/queries.json'
    );
    const queries = require('../.tmp/queries.json');
    expect(queries).toEqual({ numbers: ['One', 'Two', 'Three'] });
  });
});