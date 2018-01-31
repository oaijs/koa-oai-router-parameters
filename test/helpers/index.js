const supertest = require('supertest');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const Router = require('koa-oai-router');

const { Plugin } = Router;

async function init(opts) {
  const app = new Koa();
  const router = new Router(opts);
  const { plugins } = opts;

  Object.values(plugins).forEach((plugin) => {
    router.mount(plugin);
  });

  app.use(bodyParser());
  app.use(router.routes());

  await new Promise((resolve, reject) => {
    router.on('ready', resolve);
    router.on('error', reject);
  });

  return {
    app,
    router,
    request: supertest(app.callback()),
  };
}

module.exports = {
  init,
  Router,
  Plugin,
};
