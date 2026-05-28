import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [ProxyController],
})
export class ProxyModule {}
