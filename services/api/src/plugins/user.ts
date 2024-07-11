import { get } from '~/lib/redis'

import { appLogger } from '~/lib/logger/appLogger';

import allowedAttributes from '~/../mapping/labs.attributes.json'

async function getConfigApiKey(key) {
  let apikeyConfig;
  try {
    apikeyConfig = await get(key)
  } catch (err) {
    appLogger.error(`[redis]: Cannot get config of [${key}]`)
  }

  if (!apikeyConfig) {
    return {};
  }

  return apikeyConfig;
}

export async function user(request, reply) {
  const keyFromHeaders = request.headers['x-api-key'];
  const keyFromQuery = request.query['apikey'];

  if (keyFromHeaders && keyFromQuery && keyFromHeaders !== keyFromQuery) {
    reply.code(418);
  }

  let key;

  if (keyFromHeaders || keyFromQuery) {
    key = keyFromHeaders ? keyFromHeaders : keyFromQuery
  }

  if (!key) {
    reply.code(401).send({ error: 'API key is missing' });
    return;
  }

  const apikeyConfig = await getConfigApiKey(key);

  if (!apikeyConfig) {
    reply.code(403).send({ error: 'Invalid API key' });
    return;
  }

  if (!request.data) {
    request.data = {};
  }


  request.data.apiKeyConfig = apikeyConfig;
}

export async function checkApikeyConfig(request, reply) {
  let requestedAttributes = request.body.attributes;
  const { apiKeyConfig } = request.data

  request.data.attributes = requestedAttributes;

  if (apiKeyConfig.attributes === ['*']) {
    return;
  }
  

  if (!requestedAttributes) {
    requestedAttributes = apiKeyConfig.attributes;
    request.data.attributes = apiKeyConfig.attributes
  }

  requestedAttributes.forEach((field) => {
    if (!apiKeyConfig.attributes.includes(field)) {
      reply.code(403).send({ error: `You don't have access to ${field}` });
    }
  });
}
