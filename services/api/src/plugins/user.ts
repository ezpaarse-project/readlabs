import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ApiKeyConfig } from '~/models/apikey';

import { get } from '~/lib/redis';

import appLogger from '~/lib/logger/appLogger';

/**
 * Get config of API key.
 *
 * @param key apikey.
 * @returns Config of API key.
 */
async function getConfigApiKey(key: string): Promise<ApiKeyConfig | null> {
  let apikeyConfig: ApiKeyConfig;
  try {
    apikeyConfig = await get(key);
  } catch (err) {
    appLogger.error(`[redis]: Cannot get config of [${key}]`);
  }

  if (!apikeyConfig) {
    return null;
  }

  return apikeyConfig;
}
/**
 * Route middleware for user.
 *
 * @param request
 * @param reply
 */
export async function user(
  request: FastifyRequest<{
    Querystring: {
      apikey: string
    },
    Body: {
      attributes: string[]
      ids: string[]
    }
  }>,
  reply: FastifyReply,
): Promise<void> {
  const keyFromHeaders = Array.isArray(request.headers['x-api-key']) ? request.headers['x-api-key'][0] : request.headers['x-api-key'];
  const keyFromQuery = request.query.apikey;

  if (keyFromHeaders && keyFromQuery && keyFromHeaders !== keyFromQuery) {
    reply.code(418);
  }

  let key: string;

  if (keyFromHeaders || keyFromQuery) {
    key = keyFromHeaders || keyFromQuery;
  }

  if (!key) {
    reply.code(401).send({ error: 'API key is missing' });
    return;
  }

  const apikeyConfig: ApiKeyConfig = await getConfigApiKey(key);

  if (!apikeyConfig) {
    reply.code(403).send({ error: 'Invalid API key' });
    return;
  }

  request.data.apiKeyConfig = apikeyConfig;
}

/**
 * Middleware that checks whether users have rights to the attributes they request.
 *
 * @param request
 * @param reply
 */
export async function checkApiKeyConfig(
  request: FastifyRequest<{
    Querystring: {
      apikey: string
    },
    Body: {
      attributes: string[]
    }
  }>,
  reply: FastifyReply,
): Promise<void> {
  let requestedAttributes = request.body.attributes;
  const { apiKeyConfig } = request.data;

  request.data.attributes = requestedAttributes;

  if (apiKeyConfig.attributes.every((attr) => attr === '*')) {
    return;
  }

  if (!requestedAttributes) {
    requestedAttributes = apiKeyConfig.attributes;
    request.data.attributes = apiKeyConfig.attributes;
  }

  requestedAttributes.forEach((field) => {
    if (!apiKeyConfig.attributes.includes(field)) {
      reply.code(403).send({ error: `You don't have access to ${field}` });
    }
  });
}
