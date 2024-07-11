import type { FastifyPluginAsync } from 'fastify';

import { all } from '~/plugins/all';

const router: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {},
    preHandler: all,
    handler: (request, reply) => {
      reply.code(200).send('api service')
    },
  });

  fastify.route({
    method: 'GET',
    url: '/ping',
    schema: {},
    preHandler: all,
    handler: (request, reply) => {
      reply.code(204)
    },
  });
};

export default router;