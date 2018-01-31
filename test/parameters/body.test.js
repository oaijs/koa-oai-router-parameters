const middleware = require('koa-oai-router-middleware');

const { init } = require('../helpers');
const parameters = require('../..');

describe('body', () => {
  it('valid body, should success', async () => {
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
      .post('/api/pets')
      .send({
        name: 'abc',
        tags: 'dog',
      })
      .expect(200);

    expect(ret.text).toMatch('success');
  });

  it('invalid body, disable body validator, should success', async () => {
    const { request } = await init({
      apiDoc: './test/parameters/api',
      plugins: {
        parameters: parameters({ body: false }),
        middleware: middleware(),
      },
      options: {
        middleware: './test/parameters/controllers',
      },
    });

    const ret = await request
      .post('/api/pets')
      .send({
        tags: 'dog',
      })
      .expect(200);

    expect(ret.text).toMatch('success');
  });

  it('invalid body, should error', async () => {
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
      .post('/api/pets')
      .send({
        tags: 'dog',
      })
      .expect(400);

    expect(ret.body).toHaveProperty('0.keyword');
    expect(ret.body).toHaveProperty('0.dataPath');
    expect(ret.body).toHaveProperty('0.schemaPath');
    expect(ret.body).toHaveProperty('0.params');
    expect(ret.body).toHaveProperty('0.message');
  });
});
