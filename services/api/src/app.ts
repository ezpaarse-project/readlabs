import Fastify from 'fastify'

import { appLogger } from '~/lib/appLogger';
import { 
  initClient as initClientElastic,
  ping as pingElastic
 } from '~/lib/elastic';
import { 
  initClient as initClientRedis, 
  ping as pingRedis, 
  startConnection as startConnectionRedis 
} from '~/lib/redis';

import pingRouter from '~/routes/ping';
import labsRouter from '~/routes/labs';
import apiKeysRouter from '~/routes/apikey';
import elasticRouter from '~/routes/elastic';
import redisRouter from '~/routes/redis';


const start = async () => {
  const fastify = Fastify()

  await fastify.register(pingRouter, { prefix: '/' });
  await fastify.register(labsRouter, { prefix: '/labs' });
  await fastify.register(apiKeysRouter, { prefix: '/apikeys' });
  await fastify.register(elasticRouter, { prefix: '/elastic' });
  await fastify.register(redisRouter, { prefix: '/redis' });

  const address = await fastify.listen({ port: 3000, host: '::' });
  appLogger.info(`[fastify]: listening at ${address}`)

  // ping
  initClientElastic()
  await pingElastic();

  initClientRedis()
  await startConnectionRedis();
  await pingRedis();
  
};

start();