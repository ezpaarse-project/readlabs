import type { FastifyReply, FastifyRequest } from 'fastify';

import { nodeEnv } from 'config';

/**
 * Middleware for dev.
 *
 * @param request
 * @param reply
 */
export default async function dev(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  if (nodeEnv !== 'development') {
    reply.code(403).send({ error: 'You can\'t use this route in production' });
  }
}
