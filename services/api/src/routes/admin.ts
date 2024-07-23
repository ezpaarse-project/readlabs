import type { FastifyPluginAsync } from 'fastify';
import admin from '~/plugins/admin';
import rateLimit from '@fastify/rate-limit';

const router: FastifyPluginAsync = async (fastify) => {
  await fastify.register(rateLimit, {
    global: false,
    max: 2,
  });

  /**
   * Route to check if you are admin.
   * Admin only.
   */
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {},
    config: {
      rateLimit: {
        max: 60,
        timeWindow: '1 minute',
      },
    },
    handler: admin,
  });
};

export default router;
