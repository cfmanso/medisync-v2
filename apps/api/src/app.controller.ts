import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { prisma } from '@medisync/database';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async healthCheck() {
    // Tenta contar usuários para ver se o banco responde
    const userCount = await prisma.user.count();
    return {
      status: 'ok',
      database: 'connected',
      users: userCount,
    };
  }
}
