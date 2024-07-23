import type { FastifyReply, FastifyRequest } from 'fastify';

import { apikey } from 'config';

/**
 * Middleware for administrators only
 *
 * @param request
 * @param reply
 */
export default async function admin(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const key = request.headers['x-api-key'];

  if (!key) {
    reply.code(401).send({ error: 'API key is missing' });
    return;
  }

  if (key !== apikey) {
    reply.code(403).send({ error: 'Invalid API key' });
  }
}
