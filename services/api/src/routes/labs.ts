import type { FastifyPluginAsync } from 'fastify';

import { getLabsController } from '~/controllers/labs';

import { user } from '~/plugins/user';

const router: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          ids: {
            type: 'array',
            items: {
              type: 'string',
            },
            minItems: 1,
            uniqueItems: true
          }
        },
        required: ['ids'],
        additionalProperties: false
      }
    },
    preHandler: user,
    handler: async (request, reply) => {
      await getLabsController(request, reply);
    },
  });
};

export default router;