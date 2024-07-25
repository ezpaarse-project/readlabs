import type { FastifyPluginAsync } from 'fastify';
import admin from '~/plugins/admin';
import all from '~/plugins/all';

import {
  pingRedisController,
  startConnectionRedisController,
} from '~/controllers/redis';

const router: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    method: 'GET',
    url: '/ping',
    schema: {},
    preHandler: all,
    handler: pingRedisController,
  });

  fastify.route({
    method: 'GET',
    url: '/connect',
    schema: {},
    config: {
      rateLimit: {
        max: 60,
        timeWindow: '1 minute',
      },
    },
    preHandler: admin,
    handler: startConnectionRedisController,
  });
};

export default router;
