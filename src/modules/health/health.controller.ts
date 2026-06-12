import { Controller, Get, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private readonly prisma = new PrismaClient();

  @Get()
  async check() {
    const checks: Record<string, string> = {};

    // Database check
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = 'ok';
    } catch (e: unknown) {
      this.logger.error(`Health check DB failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
      checks.database = 'error';
    } finally {
      await this.prisma.$disconnect();
    }

    const isHealthy = checks.database === 'ok';

    return {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    };
  }
}
