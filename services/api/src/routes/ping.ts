import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

import all from '~/plugins/all';

const router: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {},
    preHandler: all,
    handler: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      reply.code(200).send('api service');
    },
  });

  fastify.route({
    method: 'GET',
    url: '/ping',
    schema: {},
    preHandler: all,
    handler: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      reply.code(204);
    },
  });
};

export default router;
