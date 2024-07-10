import { check, get, getAll, create, update, remove, loadDev } from '~/lib/redis'

/**
 * 
 * @param request 
 * @param reply
 */
export async function getAllController(request, reply) {
  const apiKeys = await getAll();
  reply.code(200).send(apiKeys)
}

/**
 * 
 * @param request 
 * @param reply
 */
export async function getByApikeyController(request, reply) {
  const apikey = request.param;
  const apikeyConfig = await get(apikey);
  reply.code(200).send(apikeyConfig)
}


/**
 * 
 * @param request 
 * @param reply
 */
export async function createApiKeyController(request, reply) {
  const apikeyConfig = request.body;
  const apiKeys = await create(apikeyConfig);
  reply.code(200).send(apiKeys)
}

/**
 * 
 * @param request 
 * @param reply
 */
export async function updateApiKeyController(request, reply) {
  const apikey = request.params;
  const apikeyConfig = request.body;
  const apiKeys = await update(apikey, apikeyConfig);
  reply.code(200).send(apiKeys)
}

/**
 * 
 * @param request 
 * @param reply
 */
export async function removeApiKeyController(request, reply) {
  const { apikey } = request.params;
  const isExist = await check(apikey)
  if (!isExist) {
    reply.code(404);
  } else {
    await remove(apikey);
    reply.code(202);
  }
}

/**
 * 
 * @param request 
 * @param reply
 */
export async function loadDevController(request, reply) {
  await loadDev();
  reply.code(202);
}