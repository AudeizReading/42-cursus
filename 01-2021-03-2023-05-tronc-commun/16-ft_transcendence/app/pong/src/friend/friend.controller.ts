import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { FriendService } from '../friend/friend.service';
import { JwtAuthGuard } from '../auth/jwt.authguard';
import { User } from '@prisma/client';

import { IsNumberString } from 'class-validator';
import { UsersService } from 'src/users/users.service';

export class ParamId {
  @IsNumberString()
  id: number;
}

@Controller('friend')
export class FriendController {
  constructor(
    private friendService: FriendService,
    private usersService: UsersService,
  ) {}

  @Get(':id/accept')
  @UseGuards(JwtAuthGuard)
  async accept(@Request() req, @Param() param: ParamId) {
    this.friendService.acceptFriendRequest(param.id, req.user.id);
  }

  @Get(':id/refuse')
  @UseGuards(JwtAuthGuard)
  async refuse(@Request() req, @Param() param: ParamId) {
    this.friendService.deleteFriendship(param.id, req.user.id);
  }
  
  @Get(':id/remove')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param() param: ParamId) {
    this.friendService.deleteFriendship(param.id, req.user.id);
  }
  
  @Get(':id/cancelrequest')
  @UseGuards(JwtAuthGuard)
  async cancelRequest(@Request() req, @Param() param: ParamId) {
    this.friendService.deleteFriendship(req.user.id, param.id);
  }

  @Get(':name/request')
  @UseGuards(JwtAuthGuard)
  async requestFriend(@Request() req, @Param() param: any) {
    try {
      const target_user: User | null = await this.usersService.user({name: param.name});
      if (!target_user) {
        return false;
      }
      console.log(`Target: ${target_user.name}`);
      await this.friendService.createFriend(req.user.name, req.user.id, target_user.id);
      return true;
    }
    catch (error) {
      return false;
    }
  }
}
