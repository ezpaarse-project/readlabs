import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { mkdir } from 'fs/promises';
import { resolve } from 'path';

import appLogger from '~/lib/logger/appLogger';
import accessLogger from '~/lib/logger/access';

import {
  initClient as initClientElastic,
  ping as pingElastic,
} from '~/lib/elastic';
import {
  initClient as initClientRedis,
  ping as pingRedis,
  startConnection as startConnectionRedis,
  get as getApiKey,
} from '~/lib/redis';

import rateLimiter from '~/plugins/rateLimit';

import ajv from '~/lib/ajv';

import healthcheckRouter from '~/routes/healthcheck';
import pingRouter from '~/routes/ping';
import labsRouter from '~/routes/labs';
import adminRouter from '~/routes/admin';
import configRouter from '~/routes/config';
import apiKeysRouter from '~/routes/apikey';
import elasticRouter from '~/routes/elastic';
import redisRouter from '~/routes/redis';

import cleanLogFileCron from '~/cron/cleanLogFile';

import { logConfig, config } from '~/lib/config';

const { paths } = config;

const start = async () => {
  // create log directory
  await mkdir(resolve(paths.log.applicationDir), { recursive: true });
  await mkdir(resolve(paths.log.accessDir), { recursive: true });
  await mkdir(resolve(paths.log.healthCheckDir), { recursive: true });

  const fastify = Fastify();

  // Register cors
  await fastify.register(
    fastifyCors,
    { origin: '*' },
  );

  fastify.setValidatorCompiler(({ schema }) => ajv.compile(schema));

  // Measure response time
  fastify.addHook('onRequest', (request, reply, done) => {
    request.startTime = Date.now();
    done();
  });

  fastify.addHook('onResponse', (request, reply, done) => {
    request.endTime = Date.now();
    request.time = request.endTime - request.startTime;
    done();
  });

  // access logger
  fastify.addHook('onResponse', async (
    request: FastifyRequest,
    reply: FastifyReply,
  ):Promise<void> => {
    if (request.url === '/healthcheck') {
      return;
    }

    let apiKeyName = '-';

    if (request.headers['x-api-key']) {
      const apiKey = Array.isArray(request.headers['x-api-key']) ? request.headers['x-api-key'][0] : request.headers['x-api-key'];
      const apiKeyConfig = await getApiKey(apiKey);
      if (apiKeyConfig) {
        apiKeyName = apiKeyConfig.name;
      }
    }

    accessLogger.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      contentLength: reply.getHeader('content-length') || 0,
      userAgent: request.headers['user-agent'] || '-',
      apiKeyName,
    });
  });

  // rate limit
  await fastify.register(rateLimiter);

  // routes
  await fastify.register(healthcheckRouter, { prefix: '/' });
  await fastify.register(pingRouter, { prefix: '/' });
  await fastify.register(adminRouter, { prefix: '/login' });
  await fastify.register(configRouter, { prefix: '/config' });
  await fastify.register(labsRouter, { prefix: '/labs' });
  await fastify.register(apiKeysRouter, { prefix: '/apikeys' });
  await fastify.register(elasticRouter, { prefix: '/elastic' });
  await fastify.register(redisRouter, { prefix: '/redis' });

  const address = await fastify.listen({ port: 3000, host: '::' });
  appLogger.info(`[fastify]: listening at [${address}]`);

  // show config
  logConfig();

  // ping
  initClientElastic();
  await pingElastic();

  initClientRedis();
  await startConnectionRedis();
  await pingRedis();

  if (cleanLogFileCron.active) {
    cleanLogFileCron.start();
  }
};

start();
