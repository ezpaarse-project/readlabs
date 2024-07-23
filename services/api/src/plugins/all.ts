import type { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Middleware for everybody.
 *
 * @param request
 * @param reply
 * @param done
 */
export default function all(
  request: FastifyRequest,
  reply: FastifyReply,
  done: (err?: Error) => void,
): void {
  done();
}
