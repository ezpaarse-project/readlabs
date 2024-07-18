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
  reply.code(200).send({ message: 'Pong' });
}

/**
 * Controller to connect redis client to redis
 *
 * @param request
 * @param reply
 */
export async function startConnectionRedisController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await startConnectionRedis();
  reply.code(200).send();
}
