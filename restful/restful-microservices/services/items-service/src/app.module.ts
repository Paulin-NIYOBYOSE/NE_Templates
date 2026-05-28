import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './items/items.module';
import { TagsModule } from './tags/tags.module';
import { ReportsModule } from './reports/reports.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ItemsModule,
    TagsModule,
    ReportsModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
