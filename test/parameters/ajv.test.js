const middleware = require('koa-oai-router-middleware');

const { init } = require('../helpers');
const parameters = require('../..');

describe('ajv', () => {
  it('ajv is function, should success', async () => {
    const { request } = await init({
      apiDoc: './test/parameters/api',
      plugins: [
        parameters,
        middleware,
      ],
      options: {
        middleware: './test/parameters/controllers',
        parameters: {
          ajv: (Ajv) => {
            return new Ajv();
          },
        },
      },
    });

    const ret = await request
      .post('/api/pets')
      .send({
        name: 'abc',
        tags: 'dog',
      })
      .expect(200);

    const ret1 = await request
      .post('/api/pets')
      .send({
        // name: 'abc',
        tags: 'dog',
      })
      .expect(400);

    expect(ret.text).toMatch('success');
    expect(ret1.body).toHaveProperty('0.keyword');
    expect(ret1.body).toHaveProperty('0.dataPath');
    expect(ret1.body).toHaveProperty('0.schemaPath');
    expect(ret1.body).toHaveProperty('0.params');
    expect(ret1.body).toHaveProperty('0.message');
  });

  it('ajv is plain object', async () => {
    const { request } = await init({
      apiDoc: './test/parameters/api',
      plugins: [
        parameters,
        middleware,
      ],
      options: {
        middleware: './test/parameters/controllers',
        parameters: {
          ajv: { logger: true },
        },
      },
    });

    const ret = await request
      .post('/api/pets')
      .send({
        name: 'abc',
        tags: 'dog',
      })
      .expect(200);

    const ret1 = await request
      .post('/api/pets')
      .send({
        // name: 'abc',
        tags: 'dog',
      })
      .expect(400);

    expect(ret.text).toMatch('success');
    expect(ret1.body).toHaveProperty('0.keyword');
    expect(ret1.body).toHaveProperty('0.dataPath');
    expect(ret1.body).toHaveProperty('0.schemaPath');
    expect(ret1.body).toHaveProperty('0.params');
    expect(ret1.body).toHaveProperty('0.message');
  });
});
