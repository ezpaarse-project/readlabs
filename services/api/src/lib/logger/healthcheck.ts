import winston from 'winston';

import { paths } from 'config';

export default winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: `${paths.log.healthCheckDir}/healthcheck.log` }),
  ],
});
