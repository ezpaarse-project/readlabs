import type { FastifyPluginAsync } from 'fastify';

import getLabsController from '~/controllers/labs';

import { user, checkApiKeyConfig } from '~/plugins/user';

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
            uniqueItems: true,
          },
          attributes: {
            type: 'array',
            isAllowedAttribute: true,
            items: { type: 'string' },
            minItems: 1,
            uniqueItems: true,
          },
        },
        required: ['ids'],
        additionalProperties: false,
      },
    },
    preHandler: [user, checkApiKeyConfig],
    handler: getLabsController,
  });
};

export default router;
