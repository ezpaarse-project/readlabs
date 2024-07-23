import type { FastifyReply, FastifyRequest } from 'fastify';
import type { estypes as ES } from '@elastic/elasticsearch';
import { elasticsearch } from 'config';

import { search } from '~/lib/elastic';

/**
 * Controller to request elastic to get labs data.
 * The ids of labs is sent by the body.
 * The attributes requested is sent by the data.
 *
 * @param request
 * @param reply
 */
export default async function getLabsController(
  request: FastifyRequest<{
    Querystring: {
      apikey: string
    },
    Body: {
      attributes: string[]
      ids: string[]
    }
  }>,
  reply: FastifyReply,
): Promise<void> {
  const { ids } = request.body;
  const { attributes } = request.data;

  const body: ES.SearchRequest['body'] = {
    query: {
      bool: {
        filter: [
          {
            terms: {
              codeUnite: ids,
            },
          },
        ],
      },
    },
    _source: attributes,
  };

  const labs = await search(elasticsearch.indexBase, ids.length, body);
  reply.code(200).send(labs);
}
