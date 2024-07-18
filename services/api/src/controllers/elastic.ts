import type { FastifyReply, FastifyRequest } from 'fastify';

import {
  ping as pingElastic,
  initClient as initElasticClient,
} from '~/lib/elastic';

/**
 * Controller to ping elastic.
 *
 * @param request
 * @param reply
 */
export async function pingElasticController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await pingElastic();
  reply.code(200).send({ message: 'Pong' });
}

/**
 * Controller to connect elastic client to elastic.
 *
 * @param request
 * @param reply
 */
export async function startConnectionElasticController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await initElasticClient();
  reply.code(200).send();
}
