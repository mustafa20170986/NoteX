import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard)
  @Post('createuser')
  createuser(@Body() data: { id: string; name: string; email: string }) {
    console.log('➡️ [SYNC ENDPOINT] Frontend is saving User ID:', data.id);
    return this.userService.createuser(data.id, data.name, data.email);
  }
}
