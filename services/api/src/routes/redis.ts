import type { FastifyPluginAsync } from 'fastify';
import { admin } from '~/plugins/admin';
import { all } from '~/plugins/all';

import { 
  ping as pingRedis,
  startConnection as startConnectionRedis 
} from '~/lib/redis';

const router: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    method: 'GET',
    url: '/ping',
    schema: {},
    preHandler: all,
    handler: async (request) => {
      const ping = await pingRedis();
      return ping;
    },
  });

  fastify.route({
    method: 'GET',
    url: '/connect',
    schema: {},
    preHandler: admin,
    handler: async (request) => {
      await startConnectionRedis();
      return null
    },
  });
};

export default router;