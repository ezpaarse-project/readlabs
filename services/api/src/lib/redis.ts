import { createClient, RedisClientType } from 'redis';
import { promisify } from 'util';
import { createHash } from 'crypto';
import { format } from 'date-fns';

import { redis } from 'config';
import appLogger from '~/lib/logger/appLogger';

import type { ApiKeyConfig, ApiKey } from '~/models/apikey';

import labsAttributes from '../../mapping/labs.attributes.json';

let redisClient: RedisClientType | undefined;

let redisGet: ReturnType<typeof promisify> | undefined;
let redisPing: ReturnType<typeof promisify> | undefined;
let redisSet: ReturnType<typeof promisify> | undefined;
let redisDel: ReturnType<typeof promisify> | undefined;
let redisKeys: ReturnType<typeof promisify> | undefined;

/**
 * Init redis client.
 */
export function initClient() {
  try {
    redisClient = createClient({
      legacyMode: true,
      socket: {
        host: redis.host,
        port: redis.port,
      },
      password: redis.password,
    });
    appLogger.info('[redis]: client is created');
  } catch (err) {
    appLogger.error(`[redis]: Cannot create redis client - ${err}`);
    throw err;
  }

  redisGet = promisify(redisClient.get);
  redisPing = promisify(redisClient.ping);
  redisSet = promisify(redisClient.set);
  redisDel = promisify(redisClient.del);
  redisKeys = promisify(redisClient.keys);
}

/**
 * Ping redis service.
 *
 * @returns ping.
 */
export async function ping(): Promise<boolean> {
  try {
    if (!redisPing) {
      throw new Error('[redis]: Client is not created');
    }

    await redisPing();
  } catch (err) {
    appLogger.error(`[redis]: Cannot ping ${redis.host}:${redis.port}`, err);
    return false;
  }
  appLogger.info(`[redis]: Success ping to ${redis.host}:${redis.port}`);
  return true;
}

/**
 * Start connection to redis.
 *
 * @returns is started.
 */
export async function startConnection(): Promise<void> {
  try {
    await redisClient.connect();
  } catch (err) {
    appLogger.error(`[redis]: Cannot connect to ${redis.host}:${redis.port}`, err);
    throw err;
  }
  appLogger.info(`[redis]: Connection success to ${redis.host}:${redis.port}`);
}

/**
 * Check if apikey exist.
 *
 * @param apikey ApiKey.
 *
 * @returns Is exist.
 */
export async function check(apikey: string): Promise<boolean> {
  if (!redisGet) {
    throw new Error('[redis]: Client is not created');
  }

  return !!await redisGet(apikey);
}

/**
 * Get apikey config
 *
 * @returns apikey config
 */
export async function get(apikey: string): Promise<ApiKeyConfig | null> {
  let apikeyConfig;
  try {
    if (!redisGet) {
      throw new Error('[redis]: Client is not created');
    }

    apikeyConfig = await redisGet(apikey);
  } catch (err) {
    appLogger.error(`[redis]: Cannot get config of apikey [${apikey}]`, err);
    throw err;
  }
  try {
    apikeyConfig = JSON.parse(apikeyConfig);
  } catch (err) {
    appLogger.error(`[redis]: Cannot parse to json [${apikeyConfig}]`, err);
    throw err;
  }

  return apikeyConfig;
}

/**
 * Get all API Keys.
 *
 * @returns all API Keys.
 */
export async function getAllKeys(): Promise<string[] | null> {
  let keys: string[];
  try {
    if (!redisKeys) {
      throw new Error('[redis]: Client is not created');
    }

    keys = await redisKeys('*');
  } catch (err) {
    appLogger.error('[redis]: Cannot get all keys');
    throw err;
  }

  return keys;
}

/**
 * Get all apiKeys with their config.
 *
 * @returns all API Keys with their config.
 */
export async function getAll(): Promise<ApiKey[] | null> {
  const keys = await getAllKeys();

  const allKeys: Array<ApiKey> = [];

  const promises = keys.map(async (key) => {
    let config;
    try {
      config = await get(key);
    } catch (err) {
      appLogger.error(`[redis] Cannot get config of API key [${key}]`);
      throw err;
    }

    allKeys.push({ apikey: key, config });
  });

  await Promise.all(promises);

  return allKeys;
}

/**
 * create random key for new API key.
 *
 * @returns random key.
 */
function createRandomKey(): string {
  const currentDate = Date.now();
  const random = Math.random().toString();
  return createHash('sha256').update(`${currentDate}${random}`).digest('hex');
}

/**
 * Create new API key.
 *
 * @returns new API key and his config.
 */
export async function create(apiKeyConfig): Promise<ApiKey | null> {
  const {
    name, owner, description,
  } = apiKeyConfig;

  let {
    allowed,
    attributes,
  } = apiKeyConfig;

  if (typeof allowed !== 'boolean') allowed = true;
  if (attributes.length === labsAttributes.length) { attributes = ['*']; }
  if (!attributes) { attributes = ['*']; }

  const keys = await getAll();

  // check if API key already exist
  for (let i = 0; i < keys.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const apiKey: ApiKeyConfig = await get(keys[i].apikey);

    if (apiKey.name === name) {
      throw new Error(`Name [${name}] already exist for a key`);
    }
  }

  const newKey = createRandomKey();
  const realApiKeyConfig = {
    name,
    owner,
    description,
    allowed,
    attributes,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
  };

  try {
    await redisClient.set(newKey, `${JSON.stringify(realApiKeyConfig)}`);
  } catch (err) {
    appLogger.error(`[redis]: Cannot create apikey with config [${realApiKeyConfig}]`, err);
    throw new Error('Cannot create apikey');
  }

  return { apikey: newKey, config: realApiKeyConfig };
}

/**
 * Update config of API key.
 *
 * @param apikey API key.
 * @param apikeyConfig New config of API key.
 *
 * @returns New config.
 */
export async function update(apikey, apikeyConfig) {
  const {
    name, owner, description, attributes, allowed,
  } = apikeyConfig;

  const config = await get(apikey);
  if (name) config.name = name;
  if (attributes) config.attributes = attributes;
  if (typeof owner === 'string') config.owner = owner;
  if (typeof description === 'string') config.description = description;
  if (typeof allowed === 'boolean') config.allowed = allowed;

  if (attributes && attributes.length === labsAttributes.length) { config.attributes = ['*']; }

  try {
    await redisSet(apikey, `${JSON.stringify(config)}`);
  } catch (err) {
    appLogger.error(`[redis]: Cannot update apikey [${apikey}] for [${name}]`, err);
    throw err;
  }

  return config;
}

/**
 * Remove API key.
 *
 * @param apikey API key.
 */
export async function remove(apikey: string): Promise<void> {
  try {
    await redisDel(apikey);
  } catch (err) {
    appLogger.error(`[redis]: Cannot delete apikey [${apikey}]`, err);
    throw err;
  }
}

/**
 * Load dev API key.
 */
export async function loadDev() {
  const { default: apiKeys } = await import('../../apikey-dev.json');

  for (let i = 0; i < apiKeys.length; i += 1) {
    const { apikey } = apiKeys[i];
    const configApiKey = apiKeys[i].config as ApiKeyConfig;

    try {
      // eslint-disable-next-line no-await-in-loop
      await redisSet(apikey, JSON.stringify(configApiKey));
      appLogger.info(`[redis]: ${configApiKey.name} is loaded`);
    } catch (err) {
      appLogger.error(`[redis]: Cannot load [${apikey}] with config [${JSON.stringify(configApiKey)}]`, err);
      throw err;
    }
  }
}
