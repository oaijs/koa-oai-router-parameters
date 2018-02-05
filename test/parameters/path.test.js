const middleware = require('koa-oai-router-middleware');

const { init } = require('../helpers');
const parameters = require('../..');

describe('path', () => {
  it('valid path, should success', async () => {
    const { request } = await init({
      apiDoc: './test/parameters/api',
      plugins: [
        parameters,
        middleware,
      ],
      options: {
        middleware: './test/parameters/controllers',
        parameters: {},
      },
    });

    const ret = await request
      .get('/api/pets/1234')
      .expect(200);

    expect(ret.text).toMatch('success');
  });


  it('invalid path, disable path validator, should success', async () => {
    const { request } = await init({
      apiDoc: './test/parameters/api',
      plugins: [
        parameters,
        middleware,
      ],
      options: {
        middleware: './test/parameters/controllers',
        parameters: { path: false },
      },
    });

    const ret = await request
      .get('/api/pets/abc')
      .expect(200);

    expect(ret.text).toMatch('success');
  });

  it('invalid path, should error', async () => {
    const { request } = await init({
      apiDoc: './test/parameters/api',
      plugins: [
        parameters,
        middleware,
      ],
      options: {
        middleware: './test/parameters/controllers',
        parameters: {},
      },
    });

    const ret = await request
      .get('/api/pets/abc')
      .expect(400);

    expect(ret.body).toHaveProperty('0.keyword');
    expect(ret.body).toHaveProperty('0.dataPath');
    expect(ret.body).toHaveProperty('0.schemaPath');
    expect(ret.body).toHaveProperty('0.params');
    expect(ret.body).toHaveProperty('0.message');
  });
});
