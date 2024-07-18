import type { FastifyRequest, FastifyReply } from 'fastify';

import type { ApiKey, ApiKeyConfig } from '~/models/apikey';

import {
  check, get, getAll, create, update, remove, loadDev,
} from '~/lib/redis';

/**
 * Controller to get all keys of API key.
 *
 * @param request
 * @param reply
 */
export async function getAllController(
  request: FastifyRequest,
  reply: FastifyReply,
):Promise<void> {
  const apiKeys = await getAll();
  reply.code(200).send(apiKeys);
}

/**
 * Controller to get config of API key.
 * The apiKey is sent by the params.
 *
 * @param request
 * @param reply
 */
export async function getApiKeyConfigController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { apikey } = request.params as { apikey: string };
  const apikeyConfig: ApiKeyConfig = await get(apikey);
  reply.code(200).send(apikeyConfig);
}

/**
 * Controller to create new API key.
 * The apiKey config is sent by the body.
 *
 * @param request
 * @param reply
 */
export async function createApiKeyController(
  request: FastifyRequest<{
    Body: ApiKeyConfig,
  }>,
  reply: FastifyReply,
): Promise<void> {
  const apikeyConfig: ApiKeyConfig = request.body;
  const apiKeys: ApiKey = await create(apikeyConfig);
  reply.code(200).send(apiKeys);
}

/**
 * Controller to update API key.
 * The new apiKey config is sent by the body.
 *
 * @param request
 * @param reply
 */
export async function updateApiKeyController(
  request: FastifyRequest<{
    Params: {
      apikey: string
    }
    Body: ApiKeyConfig,
  }>,
  reply: FastifyReply,
): Promise<void> {
  const { apikey } = request.params as { apikey: string };
  const apikeyConfig: ApiKeyConfig = request.body;
  const apiKeys: ApiKeyConfig = await update(apikey, apikeyConfig);
  reply.code(200).send(apiKeys);
}

/**
 * Controller to delete API key.
 * The apiKey is sent by the params.
 *
 * @param request
 * @param reply
 */
export async function removeApiKeyController(
  request: FastifyRequest<{
    Params: {
      apikey: string
    }
  }>,
  reply: FastifyReply,
): Promise<void> {
  const { apikey } = request.params;
  const isExist: boolean = await check(apikey);
  if (!isExist) {
    reply.code(404).send();
  } else {
    await remove(apikey);
    reply.code(202).send();
  }
}

/**
 * Controller to load dev API keys.
 *
 * @param request
 * @param reply
 */
export async function loadDevController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await loadDev();
  reply.code(202).send();
}
