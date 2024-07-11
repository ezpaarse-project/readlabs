import type { FastifyPluginAsync } from 'fastify';

import { admin } from '~/plugins/admin';
import { all } from '~/plugins/all';
import { dev } from '~/plugins/dev';

import { 
  getAllController,
  getByApikeyController,
  createApiKeyController,
  updateApiKeyController,
  removeApiKeyController,
  loadDevController,
} from '~/controllers/apikey';

function getSchema(isCreate: boolean) {
  return {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        owner: { type: 'string' },
        description: { type: 'string' },
        allowed: { type: 'boolean' },
        attributes: {
          type: 'array',
          isAllowedAttribute: true,
          items: { type: 'string' },
          minItems: 1
        }
      },
      required: isCreate ? ['name'] : [],
      additionalProperties: false
    }
  }
}

const router: FastifyPluginAsync = async (fastify) => {

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {},
    preHandler: admin,
    handler: async (request, reply) => {
      await getAllController(request, reply)
    },
  });

  fastify.route({
    method: 'GET',
    url: '/:apikey',
    schema: {},
    preHandler: all,
    handler: async (request, reply) => {
      await getByApikeyController(request, reply)
    },
  });

  fastify.route({
    method: 'POST',
    url: '/',
    schema: getSchema(true),
    preHandler: admin,
    handler: async (request, reply) => {
      await createApiKeyController(request, reply);
    },
  });

  fastify.route({
    method: 'PUT',
    url: '/:apikey',
    schema: getSchema(false),
    preHandler: admin,
    handler: async (request, reply) => {
      await updateApiKeyController(request, reply);
    },
  });

  fastify.route({
    method: 'DELETE',
    url: '/:apikey',
    schema: {},
    preHandler: admin,
    handler: async (request, reply) => {
      await removeApiKeyController(request, reply);
    },
  });

  fastify.route({
    method: 'POST',
    url: '/loadDev',
    schema: {},
    preHandler: dev,
    handler: async (request, reply) => {
      await loadDevController(request, reply);
    },
  });
};

export default router;