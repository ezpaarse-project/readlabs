import { nodeEnv } from 'config';

export async function dev(request, reply, done) {
  if (nodeEnv !== 'development') {
    reply.code(403).send({ error: 'You can\'t use this route in production' });
    return;
  }
}
