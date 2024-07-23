import type { FastifyReply, FastifyRequest } from 'fastify';

import {
  ping as pingRedis,
  startConnection as startConnectionRedis,
} from '~/lib/redis';

/**
 * Controller to ping redis
 *
 * @param request
 * @param reply
 */
export async function pingRedisController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await pingRedis();
  const endTime = Date.now();
  reply.code(200).send({ message: 'Pong', elapsedTime: endTime - request.startTime });
}

/**
 * Controller to connect redis client to redis
 *
 * @param request
 * @param reply
 */
export async function startConnectionRedisController(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await startConnectionRedis();
  reply.code(200).send();
}
