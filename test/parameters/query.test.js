const middleware = require('koa-oai-router-middleware');

const { init } = require('../helpers');
const parameters = require('../..');

describe('query', () => {
  it('valid query, should success', async () => {
    const { request } = await init({
      apiDoc: './test/parameters/api',
      plugins: {
        parameters: parameters(),
        middleware: middleware(),
      },
      options: {
        middleware: './test/parameters/controllers',
      },
    });

    const ret = await request
      .get('/api/pets')
      .query({
        tags: '1,2,3'.split(','),
        limit: 1,
      })
      .expect(200);

    expect(ret.text).toMatch('success');
  });

  it('invalid query, disable query validator, should success', async () => {
    const { request } = await init({
      apiDoc: './test/parameters/api',
      plugins: {
        parameters: parameters({ query: false }),
        middleware: middleware(),
      },
      options: {
        middleware: './test/parameters/controllers',
      },
    });

    const ret = await request
      .get('/api/pets')
      .query({
        tags: '1,2,3',
        limit: 'abc',
      })
      .expect(200);

    expect(ret.text).toMatch('success');
  });

  it('invalid query, should error', async () => {
    const { request } = await init({
      apiDoc: './test/parameters/api',
      plugins: {
        parameters: parameters(),
        middleware: middleware(),
      },
      options: {
        middleware: './test/parameters/controllers',
      },
    });

    const ret = await request
      .get('/api/pets')
      .query({
        tags: '1,2,3',
        limit: 'abc',
      })
      .expect(400);

    expect(ret.body).toHaveProperty('0.keyword');
    expect(ret.body).toHaveProperty('0.dataPath');
    expect(ret.body).toHaveProperty('0.schemaPath');
    expect(ret.body).toHaveProperty('0.params');
    expect(ret.body).toHaveProperty('0.message');
  });
});
