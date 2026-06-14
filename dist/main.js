"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const express_1 = require("express");
const path_1 = require("path");
const cookieParser = require("cookie-parser");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const winston_logger_service_1 = require("./modules/logger/winston-logger.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.useLogger(app.get(winston_logger_service_1.WinstonLoggerService));
    const logger = app.get(winston_logger_service_1.WinstonLoggerService);
    app.use((0, helmet_1.default)());
    app.use((0, express_1.json)({
        limit: '10mb',
        verify: (req, _res, buf) => {
            req.rawBody = buf;
        },
    }));
    app.use(cookieParser());
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), { prefix: '/uploads' });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const corsOrigins = process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',')
        : ['http://localhost:3000', 'http://127.0.0.1:3000'];
    app.enableCors({
        origin: corsOrigins,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('FlowPass API')
        .setDescription('Loyalty platform API — coupons, promotions, QR check-ins')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    logger.log(`FlowPass API running on port ${port}`);
    logger.log(`Swagger docs at http://localhost:${port}/docs`);
    logger.log(`Health check at http://localhost:${port}/health`);
}
bootstrap().catch(err => {
  console.error('=== STARTUP FAILED ===');
  console.error(err);
  process.exit(1);
});
//# sourceMappingURL=main.js.map