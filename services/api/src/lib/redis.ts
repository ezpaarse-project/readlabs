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

  redisClient.on('connect', () => {
    appLogger.info('[redis]: redis is connect');
  });

  redisClient.on('ready', () => {
    appLogger.info('[redis]: redis is ready');
  });

  redisClient.on('error', (err) => {
    appLogger.error(`[redis]: redis in on error [${err}]`);
  });

  redisClient.on('reconnecting', () => {
    appLogger.error('[redis]: reconnecting');
  });

  redisGet = promisify(redisClient.get);
  redisPing = promisify(redisClient.ping);
  redisSet = promisify(redisClient.set);
  redisDel = promisify(redisClient.del);
  redisKeys = promisify(redisClient.keys);
}

/**
 * Check if redis client is up.
 *
 * @returns Redis client is up.
 */
async function checkClientUp(): Promise<boolean> {
  try {
    if (!redisPing) {
      throw new Error('[redis]: Client is not created');
    }

    await redisPing();
  } catch (err) {
    appLogger.error(`[redis]: Cannot ping ${redis.host}:${redis.port}`, err);
    return false;
  }
  return true;
}

/**
 * Ping redis service.
 *
 * @returns ping.
 */
export async function ping(): Promise<boolean> {
  const redisUp: boolean = await checkClientUp();

  if (!redisUp) {
    return false;
  }

  try {
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
  if (!redisClient) {
    throw new Error('[redis]: Client is already set');
  }
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
  const redisUp: boolean = await checkClientUp();

  if (!redisUp) {
    throw new Error('[redis]: Redis client is not up');
  }

  return !!await redisGet(apikey);
}

/**
 * Get apikey config
 *
 * @returns apikey config
 */
export async function get(apikey: string): Promise<ApiKeyConfig | null> {
  const redisUp: boolean = await checkClientUp();

  if (!redisUp) {
    throw new Error('[redis]: Redis client is not up');
  }

  let apikeyConfig: string;
  try {
    if (!redisGet) {
      throw new Error('[redis]: Client is not created');
    }
    apikeyConfig = await redisGet(apikey);
  } catch (err) {
    appLogger.error(`[redis]: Cannot get config of apikey [${apikey}]`, err);
    throw err;
  }

  let apikeyConfigParsed: ApiKeyConfig;

  try {
    apikeyConfigParsed = JSON.parse(apikeyConfig);
  } catch (err) {
    appLogger.error(`[redis]: Cannot parse to json [${apikeyConfig}]`, err);
    throw err;
  }

  return apikeyConfigParsed;
}

/**
 * Get all API Keys.
 *
 * @returns all API Keys.
 */
export async function getAllKeys(): Promise<string[] | null> {
  const redisUp: boolean = await checkClientUp();

  if (!redisUp) {
    throw new Error('[redis]: Redis client is not up');
  }

  let keys: string[];

  try {
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
  const redisUp: boolean = await checkClientUp();

  if (!redisUp) {
    throw new Error('[redis]: Redis client is not up');
  }

  const keys: string[] = await getAllKeys();

  const allKeys: ApiKey[] = [];

  const promises = keys.map(async (key: string) => {
    let config : ApiKeyConfig;
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
async function createRandomKey(): Promise<string> {
  const currentDate: number = Date.now();
  const random: string = Math.random().toString();
  const key: string = createHash('sha256').update(`${currentDate}${random}`).digest('hex');
  const isExist: boolean = await check(key);
  if (isExist) {
    return createRandomKey();
  }
  return key;
}

/**
 * Create new API key.
 *
 * @returns new API key and his config.
 */
export async function create(apiKeyConfig: ApiKeyConfig): Promise<ApiKey | null> {
  const redisUp: boolean = await checkClientUp();

  if (!redisUp) {
    throw new Error('[redis]: Redis client is not up');
  }

  const {
    name, owner, description,
  } = apiKeyConfig;

  let {
    allowed,
    attributes,
  } = apiKeyConfig;

  if (typeof allowed !== 'boolean') allowed = true;
  if (!attributes || attributes.length === labsAttributes.length) {
    attributes = ['*'];
  }

  const keys = await getAll();

  // check if API key already exist
  for (let i = 0; i < keys.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const apiKey: ApiKeyConfig = await get(keys[i].apikey);

    if (apiKey.name === name) {
      throw new Error(`Name [${name}] already exist for a key`);
    }
  }

  const newKey: string = await createRandomKey();

  const newApiKeyConfig: ApiKeyConfig = {
    name,
    owner,
    description,
    allowed,
    attributes,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
  };

  try {
    await redisClient.set(newKey, `${JSON.stringify(newApiKeyConfig)}`);
  } catch (err) {
    appLogger.error(`[redis]: Cannot create apikey with config [${newApiKeyConfig}]`, err);
    throw new Error('Cannot create apikey');
  }

  return { apikey: newKey, config: newApiKeyConfig };
}

/**
 * Update config of API key.
 *
 * @param apikey API key.
 * @param apikeyConfig New config of API key.
 *
 * @returns New config.
 */
export async function update(apikey: string, apikeyConfig: ApiKeyConfig): Promise<ApiKeyConfig> {
  const redisUp: boolean = await checkClientUp();

  if (!redisUp) {
    throw new Error('[redis]: Redis client is not up');
  }

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
  const redisUp: boolean = await checkClientUp();

  if (!redisUp) {
    throw new Error('[redis]: Redis client is not up');
  }

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
  const redisUp: boolean = await checkClientUp();

  if (!redisUp) {
    throw new Error('[redis]: Redis client is not up');
  }

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
