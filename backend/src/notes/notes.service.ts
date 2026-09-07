import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}
  async createnote(title: string, content: string, authorId: string) {
    const id = randomUUID();
    const findsuer = await this.prisma.user.findFirst({
      where: { id: authorId },
    });
    if (!findsuer) {
      return { message: 'suer not found' };
    }
    const makenote = await this.prisma.note.create({
      data: {
        title,
        content,
        authorId,
        link: `NoteX_${id}`,
      },
    });
    console.log(makenote);
    return makenote;
  }
  async findnotes(authorId: string) {
    const findsuer = await this.prisma.user.findFirst({
      where: { id: authorId },
    });
    if (!findsuer) {
      throw new BadRequestException('user not found');
    }
    const findnotefast = await this.prisma.note.findMany({
      where: { authorId: authorId },
      select: { id: true, title: true },
    });
    return findnotefast;
  }

  async getnoteid(noteId: string) {
    const findnote = await this.prisma.note.findFirst({
      where: { id: noteId },
      select: { title: true, content: true },
    });
    return findnote;
  }

  async editenote(noteId: string, title: string, content: string) {
    try {
      return await this.prisma.note.update({
        where: { id: noteId },
        data: {
          title,
          content,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  async deletenote(noteId: string) {
    try {
      return await this.prisma.note.delete({
        where: {
          id: noteId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
