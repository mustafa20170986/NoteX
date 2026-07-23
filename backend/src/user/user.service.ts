import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/generated/prisma/client';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async createuser(
    id: string,
    name: string,
    email: string,
  ): Promise<User | undefined> {
    if (!email) {
      throw new BadRequestException('email is msising');
    }
    const usrmail = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (usrmail) {
      return;
    }
    const createuseR = await this.prisma.user.create({
      data: { id, name, email },
    });
    return createuseR;
  }
}
