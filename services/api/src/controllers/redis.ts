import type { FastifyReply, FastifyRequest } from 'fastify';

import {
  ping as pingRedis,
} from '~/lib/redis';

/**
 * Controller to ping redis
 *
 * @param request
 * @param reply
 */
export default async function pingRedisController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await pingRedis();
  const endTime = Date.now();
  const responseTime = endTime - request.startTime;
  reply.code(200)
    .send({ message: 'Pong', responseTime })
    .headers({ 'x-response-time': responseTime });
}
