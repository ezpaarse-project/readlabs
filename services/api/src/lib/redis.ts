import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { createClient, RedisClientType } from 'redis'
import { promisify } from 'util'
import { createHash } from 'crypto'

import { appLogger } from '~/lib/appLogger';

import { redis } from 'config';

let redisClient: RedisClientType | undefined;

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
    appLogger.info('[redis]: client is created')
  } catch (err) {
    appLogger.error(`[redis]: Cannot create redis client - ${err}`)
  }

  redisClient.get = promisify(redisClient.get);
  redisClient.ping = promisify(redisClient.ping);
  redisClient.set = promisify(redisClient.set);
  redisClient.del = promisify(redisClient.del);
  redisClient.keys = promisify(redisClient.keys);
}

/**
 * Ping redis service.
 *
 * @returns {Promise<boolean>} ping
 */
export async function ping() {
  try {
    await redisClient.ping();
  } catch (err) {
    appLogger.error(`[redis]: Cannot ping ${redis.host}:${redis.port}`, err);
    return false;
  }
  appLogger.info(`[redis]: Success ping to ${redis.host}:${redis.port}`);
  return true;
}

/**
 * Start connection to redis
 * @returns {Promise<boolean>} connected or not
 */
export async function startConnection() {
  try {
    await redisClient.connect();
  } catch (err) {
    appLogger.error(`[redis]: Cannot connect to ${redis.host}:${redis.port}`, err);
    return false;
  }
  appLogger.info(`[redis]: Connection success to ${redis.host}:${redis.port}`);
  return true;
}

/**
 * Check if apikey exist
 * @param apikey Apikey.
 *
 * @returns Apikey config.
 */
export async function check(apikey: string): Promise<boolean> {
  return !!await redisClient.get(apikey);
}

/**
 * Get apikey config
 * @returns {Promise<boolean>} connected or not
 */
export async function get(apikey) {
  let apikeyConfig;
  try {
    apikeyConfig = await redisClient.get(apikey);
  } catch (err) {
    appLogger.error(`[redis]: Cannot get config of apikey [${apikey}]`, err);
    return false;
  }
  try {
    apikeyConfig = JSON.parse(apikeyConfig)
  } catch (err) {
    appLogger.error(`[redis]: Cannot parse to json [${apikeyConfig}]`, err);
    return false;
  }

  return apikeyConfig;
}

/**
 * Get all apiKeys with their config
 * @returns {Promise<boolean>} connected or not
 */
export async function getAll() {
  let keys;
  try {
    keys = await redisClient.keys('*');
  } catch (err) {
    appLogger.error(`[redis]: Cannot get all keys ${err}`);
    return false;
  }

  return keys
}

function createRandomKey() {
  const currentDate = Date.now();
  const random = Math.random().toString();
  return createHash('sha256').update(`${currentDate}${random}`).digest('hex');
}

export async function create(apikeyConfig) {
  const {
    name, owner, description, allowed, attributes,
  } = apikeyConfig;

  const keys = await getAll()

  // check if apikey already exist
  for (let i = 0; i < keys.length; i += 1) {
    let apiKeyConfig = await get(keys[i])

    if (apiKeyConfig.name === name) {
      throw new Error(`Name [${name}] already exist for a key`);
    }
  }

  let apikey;

  const newKey = createRandomKey();

  try {
    apikey = await redisClient.set(newKey, `${JSON.stringify(apikeyConfig)}`);
  } catch (err) {
    appLogger.error(`[redis]: Cannot create apikey with config [${{
      name, attributes, owner, description, allowed,
    }}]`, err);
    throw new Error(`Cannot create apikey`);
  }

  return { apikey: newKey, config: apikeyConfig }
}

export async function update(apikey, apikeyConfig) {
  const {
    name, owner, description, attributes, allowed,
  } = apikeyConfig;

  let config = await get(apikey);

  if (name) config.name = name;
  if (attributes) config.attributes = attributes;
  if (typeof owner === 'string') config.owner = owner;
  if (typeof description === 'string') config.description = description;
  if (typeof allowed === 'boolean') config.allowed = allowed;

  try {
    await redisClient.set(apikey, `${JSON.stringify(config)}`);
  } catch (err) {
    appLogger.error(`[redis]: Cannot update apikey [${apikey}] for [${name}]`, err);
    throw err;
  }
}

export async function remove(apikey) {
  try {
    await redisClient.del(apikey);
  } catch (err) {
    appLogger.error(`[redis]: Cannot delete apikey [${apikey}]`, err);
    return false;
  }
  return true;
}

export async function loadDev() {
  let apiKeys = await readFile(resolve(__dirname, '..', '..', 'apikey-dev.json'), 'utf8');

  try {
    apiKeys = JSON.parse(apiKeys);
  } catch (err) {
    appLogger.error()
    throw err;
  }
  

  for (let i = 0; i < apiKeys.length; i += 1) {
    const { apikey } = apiKeys[i];
    const configApikey = apiKeys[i].config;

    try {
      await redisClient.set(apikey, JSON.stringify(configApikey));
      appLogger.info(`[redis]: ${configApikey.name} is loaded`);
    } catch (err) {
      appLogger.error(`[redis]: Cannot load [${apikey}] with config [${JSON.stringify(configApikey)}]`, err);
      throw err;
    }
  }
}
