import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
      format: isProduction
        ? winston.format.combine(winston.format.timestamp(), winston.format.json())
        : winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
              const ctx = context ? `[${context}]` : '';
              const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
              return `${timestamp} ${level} ${ctx} ${message}${metaStr}`;
            }),
          ),
      transports: [new winston.transports.Console()],
    });
  }

  log(message: unknown, context?: string) {
    this.logger.info(String(message), { context });
  }

  error(message: unknown, trace?: string, context?: string) {
    this.logger.error(String(message), { trace, context });
  }

  warn(message: unknown, context?: string) {
    this.logger.warn(String(message), { context });
  }

  debug(message: unknown, context?: string) {
    this.logger.debug(String(message), { context });
  }

  verbose(message: unknown, context?: string) {
    this.logger.verbose(String(message), { context });
  }
}
