import type { FastifyPluginAsync } from 'fastify';
import admin from '~/plugins/admin';

const router: FastifyPluginAsync = async (fastify) => {
  /**
   * Route to check if you are admin.
   * Admin only.
   */
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {},
    handler: admin,
  });
};

export default router;
