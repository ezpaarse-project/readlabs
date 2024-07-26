import type { FastifyPluginAsync } from 'fastify';
import all from '~/plugins/all';

import pingRedisController from '~/controllers/redis';

const router: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    method: 'GET',
    url: '/ping',
    schema: {},
    preHandler: all,
    handler: pingRedisController,
  });
};

export default router;
