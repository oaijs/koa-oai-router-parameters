const Router = require('koa-oai-router');
const { parametersToJsonSchema } = require('jsonschema-oai-parameters');

const { getAjv, defaultHandler } = require('./helper');

const { Plugin } = Router;

function middlewareWrapper(middlewareOpts, middlewareArgs = {}) {
  const {
    endpoint,
    field,
    fieldValue,
    operation,
    operationValue,
  } = middlewareOpts;

  const {
    header: headerSchema,
    path: pathSchema,
    query: querySchema,
    formdata: formDataSchema,
    body: bodySchema,
  } = parametersToJsonSchema(fieldValue, { lowercaseHeader: true });

  const {
    header = true,
    path = true,
    query = true,
    formData = true,
    body = true,
    ajv,
    handler = defaultHandler,
  } = middlewareArgs;

  const ajvValidator = getAjv(ajv);
  const headerValidate = ajvValidator.compile(headerSchema);
  const pathValidate = ajvValidator.compile(pathSchema);
  const queryValidate = ajvValidator.compile(querySchema);
  const formValidate = ajvValidator.compile(formDataSchema);
  const bodyValidate = ajvValidator.compile(bodySchema);

  return (ctx, next) => {
    let valid = false;
    let errors = null;

    do {
      // validate http header.
      if (header) {
        valid = headerValidate(ctx.request.headers);
        errors = headerValidate.errors;
        if (!valid) break;
      }

      // validate http path.
      if (path) {
        valid = pathValidate(ctx.params);
        errors = pathValidate.errors;
        if (!valid) break;
      }

      // validate http query.
      if (query) {
        valid = queryValidate(ctx.request.query);
        errors = queryValidate.errors;
        if (!valid) break;
      }

      // validate http formData.
      if (formData) {
        valid = formValidate(ctx.request.query);
        errors = formValidate.errors;
        if (!valid) break;
      }

      // validate http body.
      if (body) {
        valid = bodyValidate(ctx.request.body);
        errors = bodyValidate.errors;
        if (!valid) break;
      }
    } while (false);

    // valid, go next.
    if (valid) return next();

    return handler(ctx, next, Object.assign(middlewareOpts, { errors }));
  };
}

/**
 * Parameters validator
 * @param {object} args
 * @param {boolean} args.header enable header validator
 * @param {boolean} args.path enable path validator
 * @param {boolean} args.query enable query validator
 * @param {boolean} args.formData enable formData validator
 * @param {boolean} args.body enable body validator
 * @param {object|function} args.ajv ajv's options or ajv's factory with arguments (Ajv)
 * @param {function} args.handler handler when validate failed
 * @param {function}
 */
function plugin(args) {
  return new Plugin({
    name: 'validator',
    field: 'parameters',
    middlewareArgs: args,
    middlewareWrapper,
  });
}

module.exports = plugin;
