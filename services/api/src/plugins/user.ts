import { get } from '~/lib/redis'

import { appLogger } from '~/lib/appLogger';

export async function user(request, reply, done) {
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

  let apikeyConfig;
  try {
    apikeyConfig = await get(key)
  } catch (err) {
    appLogger.error(`[redis]: Cannot get config of [${key}]`)
  }

  if (!apikeyConfig) {
    reply.code(403).send({ error: 'Invalid API key' });
    return;
  }
}
