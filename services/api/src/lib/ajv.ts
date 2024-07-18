import Ajv from 'ajv';

import allowedAttributes from '~/../mapping/labs.attributes.json';

const ajv = new Ajv();

/**
 * Add keyword on Fastify to check whether the attributes sent by users are part of
 * the attributes available through the mapping of the readlabs index
 */
ajv.addKeyword({
  keyword: 'isAllowedAttribute',
  validate: (_schema: boolean, data: string[]) => {
    if (!Array.isArray(data)) return false;
    return data.every((item: string) => allowedAttributes.includes(item));
  },
  errors: false,
});

export default ajv;
