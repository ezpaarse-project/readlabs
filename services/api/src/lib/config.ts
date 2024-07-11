import config from 'config';

import { appLogger } from '~/lib/logger/appLogger';

import defaultConfig from '~/../config/default.json';

const copyConfig = JSON.parse(JSON.stringify(config));

/**
 * Get config of service.
 *
 * @returns {Object} Config of service.
 */
export function getConfig() {
  if (copyConfig.redis.apikey === defaultConfig.redis.apikey) {
    appLogger.warn('[config]: Redis apikey has the default value');
  }

  if (copyConfig.elasticsearch.password === defaultConfig.elasticsearch.password) {
    appLogger.warn('[config]: Elasticsearch password has the default value');
  }

  if (copyConfig.elasticsearch.apikey === defaultConfig.elasticsearch.apikey) {
    appLogger.warn('[config]: Elasticsearch apikey has the default value');
  }

  if (copyConfig.apikey === defaultConfig.apikey) {
    appLogger.warn('[config]: Apikey has the default value');
  }

  copyConfig.redis.apikey = '********';
  copyConfig.elasticsearch.apikey = '********';
  copyConfig.elasticsearch.password = '********';
  copyConfig.apikey = '********';

  appLogger.info(JSON.stringify(copyConfig, null, 2));

  return copyConfig;
}
