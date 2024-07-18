// fastify.d.ts
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    data?: {
      apiKeyConfig: {
        attributes: string[];
      };
      attributes?: string[];
    };
  }
}
