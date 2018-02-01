# Koa-OAI-Router-Parameters

[license-img]: http://img.shields.io/badge/license-MIT-green.svg
[license-url]: http://opensource.org/licenses/MIT

[node-image]: https://img.shields.io/badge/node.js-v6.0.0-blue.svg
[node-url]: http://nodejs.org/download/

[npm-img]: https://img.shields.io/npm/v/koa-oai-router-parameters.svg
[npm-url]: https://npmjs.org/package/koa-oai-router-parameters

[travis-img]: https://travis-ci.org/oaijs/koa-oai-router-parameters.svg
[travis-url]: https://travis-ci.org/oaijs/koa-oai-router-parameters

[coveralls-img]: https://coveralls.io/repos/github/oaijs/koa-oai-router-parameters/badge.svg
[coveralls-url]: https://coveralls.io/github/oaijs/koa-oai-router-parameters

[downloads-image]: https://img.shields.io/npm/dm/koa-oai-router-parameters.svg
[downloads-url]: https://npmjs.org/package/koa-oai-router-parameters

[david-img]: https://img.shields.io/david/oaijs/koa-oai-router-parameters.svg
[david-url]: https://david-dm.org/oaijs/koa-oai-router-parameters

[router]: https://github.com/BiteBit/koa-oai-router

[param]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameter-object
[ajv]: https://github.com/epoberezkin/ajv
[ajv-error]: https://github.com/epoberezkin/ajv#error-objects

[![License][license-img]][license-url]
[![Node Version][node-image]][node-url]
[![NPM Version][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Test Coverage][coveralls-img]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-img]][david-url]

Parameters validator plugin for [koa-oai-router][router].

# Installation
```bash
npm i koa-oai-router-parameters --save
```

# Info
|field|type|info|
|---|---|---|
|name|`string`|`validator`|
|evoked fields|`string`| `parameters`|
|evoked value|`object`| [OpenApi parameter object][param]|
|options|`object`| `header`,`path`,`query`,`formData`,`body`,`ajv`,`handler` |

* `options` `{object}`
  * `header` `{boolean}` Enable header validator. default `true`
  * `path` `{boolean}` Enable path validator. default `true`
  * `query` `{boolean}` Enable query validator. default `true`
  * `formData` `{boolean}` Enable formData validator. default `true`
  * `body` `{boolean}` Enable body validator. default `true`
  * `ajv` `{object|function}` `object` is options of [Ajv][ajv]. `function` is a factory with arguments `(Ajv)` and must return a ajv instance.
  * `handler` `{function}` Response handler when validate fail. Having arguments `(ctx, next, {errors, endpoint, field, fieldValue, operation, operationValue})`. Default handler response [Ajv Error][ajv-error] to body. e.g.
    ```js
    [{
      "keyword":"type",
      "dataPath":".size",
      "schemaPath":"#/properties/size/type",
      "params":{
        "type":"number"
        },
        "message":"should be number"
    }]
    ```

---

Simple code:
```js
const Koa = require('koa');
const Router = require('koa-oai-router');
const middlewareLoader = require('koa-oai-router-middleware');
const parametersHandler = require('koa-oai-router-parameters');

const app = new Koa();
const router = new Router({
  apiDoc: './api',
});

router.mount(middlewareLoader('./controllers'));
router.mount(parametersHandler());

app.use(bodyParser());
app.use(router.routes());
```