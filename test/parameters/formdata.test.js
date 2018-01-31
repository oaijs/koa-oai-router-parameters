const middleware = require('koa-oai-router-middleware');

const { init } = require('../helpers');
const parameters = require('../..');

describe('formData', () => {
  it('valid formData, should success', async () => {
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
      .post('/api/pets/123/image')
      .query({
        image: 'abc',
      })
      .expect(200);

    expect(ret.text).toMatch('success');
  });

  it('invalid formData, disable validator, should success', async () => {
    const { request } = await init({
      apiDoc: './test/parameters/api',
      plugins: {
        parameters: parameters({ formData: false }),
        middleware: middleware(),
      },
      options: {
        middleware: './test/parameters/controllers',
      },
    });

    const ret = await request
      .post('/api/pets/123/image')
      .query({
        image404: 'abc',
      })
      .expect(200);

    expect(ret.text).toMatch('success');
  });

  it('invalid formData, should error', async () => {
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
      .post('/api/pets/123/image')
      .query({
        image404: 'abc',
      })
      .expect(400);

    expect(ret.body).toHaveProperty('0.keyword');
    expect(ret.body).toHaveProperty('0.dataPath');
    expect(ret.body).toHaveProperty('0.schemaPath');
    expect(ret.body).toHaveProperty('0.params');
    expect(ret.body).toHaveProperty('0.message');
  });
});
