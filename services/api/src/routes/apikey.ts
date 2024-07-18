import type { FastifyPluginAsync } from 'fastify';

import admin from '~/plugins/admin';
import all from '~/plugins/all';
import dev from '~/plugins/dev';

import {
  getAllController,
  getApiKeyConfigController,
  createApiKeyController,
  updateApiKeyController,
  removeApiKeyController,
  loadDevController,
} from '~/controllers/apikey';

/**
 * schema for create or update API key.
 *
 * @param isCreate create or update.
 *
 * @returns schema
 */
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
          minItems: 1,
        },
      },
      required: isCreate ? ['name'] : [],
      additionalProperties: false,
    },
  };
}

const router: FastifyPluginAsync = async (fastify) => {
  /**
   * Route to get all keys of API key.
   * Admin only.
   */
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {},
    preHandler: admin,
    handler: getAllController,
  });

  /**
   * Route to get config of API key.
   */
  fastify.route({
    method: 'GET',
    url: '/:apikey',
    schema: {},
    preHandler: all,
    handler: getApiKeyConfigController,
  });

  /**
   * Route to create new API key.
   * Admin only.
   */
  fastify.route({
    method: 'POST',
    url: '/',
    schema: getSchema(true),
    preHandler: admin,
    handler: createApiKeyController,
  });

  /**
   * Route to update API key.
   * Admin only.
   */
  fastify.route({
    method: 'PUT',
    url: '/:apikey',
    schema: getSchema(false),
    preHandler: admin,
    handler: updateApiKeyController,
  });

  /**
   * Route to delete API key.
   * Admin only.
   */
  fastify.route({
    method: 'DELETE',
    url: '/:apikey',
    schema: {},
    preHandler: admin,
    handler: removeApiKeyController,
  });

  /**
   * Route to load dev API keys.
   * Dev only.
   */
  fastify.route({
    method: 'POST',
    url: '/loadDev',
    schema: {},
    preHandler: dev,
    handler: loadDevController,
  });
};

export default router;
