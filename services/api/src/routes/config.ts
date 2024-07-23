import type { FastifyPluginAsync } from 'fastify';
import admin from '~/plugins/admin';

import getConfigController from '~/controllers/config';

const router: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {},
    preHandler: admin,
    handler: getConfigController,
  });
};

export default router;
