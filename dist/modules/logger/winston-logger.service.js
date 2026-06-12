"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston = require("winston");
let WinstonLoggerService = class WinstonLoggerService {
    logger;
    constructor() {
        const isProduction = process.env.NODE_ENV === 'production';
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
            format: isProduction
                ? winston.format.combine(winston.format.timestamp(), winston.format.json())
                : winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.colorize(), winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
                    const ctx = context ? `[${context}]` : '';
                    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
                    return `${timestamp} ${level} ${ctx} ${message}${metaStr}`;
                })),
            transports: [new winston.transports.Console()],
        });
    }
    log(message, context) {
        this.logger.info(String(message), { context });
    }
    error(message, trace, context) {
        this.logger.error(String(message), { trace, context });
    }
    warn(message, context) {
        this.logger.warn(String(message), { context });
    }
    debug(message, context) {
        this.logger.debug(String(message), { context });
    }
    verbose(message, context) {
        this.logger.verbose(String(message), { context });
    }
};
exports.WinstonLoggerService = WinstonLoggerService;
exports.WinstonLoggerService = WinstonLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WinstonLoggerService);
//# sourceMappingURL=winston-logger.service.js.map