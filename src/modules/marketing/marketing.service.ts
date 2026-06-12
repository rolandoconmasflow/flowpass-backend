import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MarketingService {
  constructor(private readonly prisma: PrismaService) {}

  async joinWaitlist(email: string) {
    const existing = await this.prisma.waitlistEntry.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Este correo ya está en la lista de espera');
    }
    return this.prisma.waitlistEntry.create({ data: { email } });
  }
}
