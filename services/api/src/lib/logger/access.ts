import winston from 'winston';

import { paths } from 'config';

const apacheFormat = winston.format.printf(({ timestamp, level, message }) => {
  const { method, url, statusCode, contentLength, userAgent, apiKeyName } = message;
  return `${timestamp} ${method} ${url} ${statusCode} ${contentLength} ${userAgent} ${apiKeyName}`;
});
 
export const accessLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    apacheFormat
  ),
  transports: [
    new winston.transports.File({ filename: `${paths.log.accessDir}/access.log` })
  ]
});