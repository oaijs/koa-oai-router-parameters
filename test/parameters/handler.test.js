const middleware = require('koa-oai-router-middleware');

const { init } = require('../helpers');
const parameters = require('../..');

describe('handler', () => {
  it('handler is function, should success', async () => {
    const { request } = await init({
      apiDoc: './test/parameters/api',
      plugins: [
        parameters,
        middleware,
      ],
      options: {
        middleware: './test/parameters/controllers',
        parameters: {
          handler: (ctx, next, { errors }) => {
            ctx.response.status = 400;
            ctx.response.body = 'params error';
          },
        },
      },
    });

    const ret1 = await request
      .post('/api/pets')
      .send({
        // name: 'abc',
        tags: 'dog',
      })
      .expect(400);

    expect(ret1.text).toMatch('params error');
  });
});
