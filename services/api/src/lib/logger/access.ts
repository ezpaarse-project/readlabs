import winston from 'winston';

import { paths } from 'config';

const apacheFormat = winston.format.printf((info: winston.Logform.TransformableInfo) => {
  const {
    method,
    url,
    statusCode,
    contentLength,
    userAgent,
    apiKeyName,
  } = info.message;
  return `${info.timestamp} ${method} ${url} ${statusCode} ${contentLength} ${userAgent} ${apiKeyName}`;
});

export default winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    apacheFormat,
  ),
  transports: [
    new winston.transports.File({ filename: `${paths.log.accessDir}/access.log` }),
  ],
});
