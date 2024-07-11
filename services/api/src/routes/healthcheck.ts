import type { FastifyPluginAsync } from 'fastify';

import { all } from '~/plugins/all';

import { healthcheckLogger } from '~/lib/logger/healthcheck';

const router: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    method: 'GET',
    url: '/healthcheck',
    schema: {},
    preHandler: (request, reply, done) => {
      // healthcheck logger
      healthcheckLogger.info({
        method: request.method,
        url: request.url,
        headers: request.headers,
        query: request.query,
        params: request.params,
        body: request.body
      });
      done();
    },
    handler: (request, reply) => {
      reply.code(204)
    },
  });
};

export default router;