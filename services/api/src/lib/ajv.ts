
import Ajv from 'ajv';

import allowedAttributes from '~/../mapping/labs.attributes.json'

export const ajv = new Ajv()

const isAllowedAttribute = ajv.addKeyword({
  keyword: 'isAllowedAttribute',
  validate: (schema: boolean, data: string[]) => {
    if (!Array.isArray(data)) return false;
    return data.every((item: string) => allowedAttributes.includes(item));
  },
  errors: false
})

