import { search } from '~/lib/elastic'

/**
 * 
 * @param request 
 * @param reply
 */
export async function getLabsController(request, reply) {
  const { ids } = request.body;

  const body = {
    query: {
      bool: {
        filter: [
          { 
            terms: { 
              codeUnite: ids 
            } 
          },
        ],
      },
    },
  };
  
  const labs =  await search('int_cnrs-unites', 10, body);
  reply.code(200).send(labs)
}