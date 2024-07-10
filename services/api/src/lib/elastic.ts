import { Client } from '@elastic/elasticsearch';

import { resolve } from 'path';
import { readFileSync } from 'fs';

import { nodeEnv, elasticsearch } from 'config';

import { appLogger } from '~/lib/appLogger';

const isProd = (nodeEnv === 'production');

const elasticNodes = elasticsearch.nodes.split(",");
let ssl;

if (isProd) {
  let ca;
  const caPath = resolve(__dirname, '..', '..', 'certs', 'ca.crt');
  try {
    ca = readFileSync(caPath, 'utf8');
  } catch (err) {
    appLogger.error(`[elastic]: Cannot read elastic certificate file in [${caPath}]`, err);
  }
  ssl = {
    ca,
    rejectUnauthorized: true,
  };
}

let elasticClient;

export async function initClient() {
  console.log(elasticsearch);
  try {
    elasticClient = new Client({
      nodes: elasticNodes,
      auth: {
        username: elasticsearch.username,
        password: elasticsearch.password,
      },
      ssl,
      requestTimeout: 5000,
    });
    appLogger.info('[elastic]: client is created')
  } catch (err) {
    appLogger.error('[elastic]: Cannot create elastic client')
  }
}

/**
 * Ping elastic service.
 *
 * @returns {Promise<boolean>} ping
 */
export async function ping() {
  let elasticStatus;
  try {
    elasticStatus = await elasticClient.ping();
  } catch (err) {
    appLogger.error(`[elastic]: Cannot ping ${elasticsearch.nodes.split(",")}`, err);
    return false;
  }
  if (elasticStatus?.statusCode !== 200) {
    appLogger.error(`[elastic]: Cannot ping ${elasticsearch.nodes.split(",")} - ${elasticStatus?.statusCode}`);
    return false;
  }
  appLogger.info(`[elastic]: Success ping to ${elasticsearch.nodes.split(",")}`);
  return true;
}

/**
 * Search labs document in elastic by ID
 * @param {string} indexName - Index name
 * @param {number} size - Size of elements requested
 * @param {Object} body - Config of elastic request
 *
 * @returns {Object} - Elastic response
 */
export async function search(indexName, size, body) {
  let res;
  try {
    res = await elasticClient.search({
      index: indexName,
      size,
      body,
    });
  } catch (err) {
    appLogger.error(`[elastic]: Cannot request elastic in index [${indexName}]`, err);
    throw err;
  }
  // eslint-disable-next-line no-underscore-dangle
  return res.body.hits.hits.map((hit) => hit._source);
}