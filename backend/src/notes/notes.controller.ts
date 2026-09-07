import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CurrentUser } from 'src/currentuser/currentuser.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('notes')
export class NotesController {
  constructor(private readonly noteService: NotesService) {}
  @UseGuards(AuthGuard)
  @Post('crnote')
  createnote(
    @Body() data: { title: string; content: string },
    @CurrentUser() auth: any,
  ) {
    return this.noteService.createnote(data.title, data.content, auth.userId);
  }
  @Get('findnote/:authorId')
  findnote(@Param('authorId') authorId: string) {
    return this.noteService.findnotes(authorId);
  }
  @Get('getnote/:noteId')
  async getNote(@Param('noteId') noteId: string) {
    const note = await this.noteService.getnoteid(noteId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }
  @Put('editnote/:noteId')
  async editnote(
    @Param('noteId') noteId: string,
    @Body() data: { title: string; content: string },
  ) {
    return await this.noteService.editenote(noteId, data.title, data.content);
  }
  @Delete('delete/:noteId')
  async deletenote(@Param('noteId') noteId: string) {
    return this.noteService.deletenote(noteId);
  }
}
