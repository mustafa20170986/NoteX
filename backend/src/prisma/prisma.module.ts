import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Makes Prisma available everywhere without re-importing the module
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Allows other modules to use it
})
export class PrismaModule {}
