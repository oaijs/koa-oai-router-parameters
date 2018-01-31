const middleware = require('koa-oai-router-middleware');

const { init } = require('../helpers');
const parameters = require('../..');

describe('header', () => {
  it('valid header, should success', async () => {
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
      .delete('/api/pets/1234')
      .set('appKey', 'appKey')
      .set('appSecret', 'appSecret')
      .expect(200);

    expect(ret.text).toMatch('success');
  });

  it('invalid header, disable header validator, should success', async () => {
    const { request } = await init({
      apiDoc: './test/parameters/api',
      plugins: {
        parameters: parameters({ header: false }),
        middleware: middleware(),
      },
      options: {
        middleware: './test/parameters/controllers',
      },
    });

    const ret = await request
      .delete('/api/pets/1234')
      .set('appKey', 'appKey')
      // .set('appSecret', 'appSecret')
      .expect(200);

    expect(ret.text).toMatch('success');
  });

  it('invalid header, should error', async () => {
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
      .delete('/api/pets/1234')
      .set('appKey', 'appKey')
      // .set('appSecret', 'appSecret')
      .expect(400);

    expect(ret.body).toHaveProperty('0.keyword');
    expect(ret.body).toHaveProperty('0.dataPath');
    expect(ret.body).toHaveProperty('0.schemaPath');
    expect(ret.body).toHaveProperty('0.params');
    expect(ret.body).toHaveProperty('0.message');
  });
});
