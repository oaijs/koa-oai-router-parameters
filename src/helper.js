const Ajv = require('ajv-oai');
const isPlainObject = require('lodash.isplainobject');
const isFunction = require('lodash.isfunction');

/**
 * Get ajv instance.
 * @param {object|function} ajv -
 *  if `ajv` is object just optioins.
 *  if `ajv` is function must be a ajv factory with (Ajv) arguments and return a ajv instance.
 */
function getAjv(ajv) {
  let validator = null;
  const preset = { logger: false };

  // Call custom factory to create
  if (isFunction(ajv)) {
    validator = ajv(Ajv);
  } else if (isPlainObject(ajv)) {
    validator = new Ajv(Object.assign({}, ajv, preset));
  } else {
    validator = new Ajv(preset);
  }

  return validator;
}

function defaultHandler(ctx, next, { errors }) {
  ctx.response.status = 400;
  ctx.response.body = errors;
}

module.exports = {
  getAjv,
  defaultHandler,
};
