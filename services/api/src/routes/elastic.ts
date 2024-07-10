import type { FastifyPluginAsync } from 'fastify';

import { ping as pingElastic } from '~/lib/elastic';
import { all } from '~/plugins/all';

const router: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    method: 'GET',
    url: '/ping',
    schema: {},
    preHandler: all,
    handler: async (request) => {
      await pingElastic();
    },
  });
};

export default router;