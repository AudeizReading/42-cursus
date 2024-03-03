import {
  Controller,
  Post,
  Get,
  Request,
  Response,
  Param,
  UseGuards,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  StreamableFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../users/users.service';
import { NotifService } from '../notif/notif.service';
import { FriendService } from '../friend/friend.service';
import { GameService } from '../game/game.service';
import { JwtAuthGuard } from '../auth/jwt.authguard';

import { IsNumberString, IsString } from 'class-validator';
import { get } from 'http';
import * as crypto from 'crypto';
import * as base32 from 'thirty-two';

export class ParamUserProfile {
  @IsNumberString()
  userid: number;
}

export class ParamFileInPsql {
  @IsString()
  filename: string;
}

class ParamBestUsersLimit {
  @IsNumberString()
  limit: number;
}

class NewNameDTO {
  newName: string;
}

@Controller()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private notifService: NotifService,
    private friendService: FriendService,
    private gameService: GameService,
  ) {}

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  async user_info(@Request() req) {
    // console.log(req.user) // <== check avalaible data served by ../auth/jwt.strategy.ts:validate
    this.usersService.updateUser({
      where: {
        id: req.user.id
      },
      data: {
        lastFetch: new Date
      }
    });
    return {
      connected: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar.replace(
          '://<<host>>',
          '://' + process.env.FRONT_HOST,
        ),
        matchmaking_state: req.user.mMaking?.state || null,
        matchmaking_remaining:
          req.user.mMaking?.state === 'MATCHED'
            ? req.user.mMaking.updatedAt
            : null,
        is_playing: req.user.isPlaying
      },
      ...(await this.notifService.objectForFront(req.user.id)),
      friends: await this.friendService.objectForFront(req.user.id),
      matchmaking_users: await this.gameService.listTenMatchMakings(), // pas opti de le faire à chaque fois mais ok pour les besoins de l'eval
      lastFetch: Date.now(),
      doubleFA: (!req.user.doubleFA || req.user.doubleFA === '')
        ? base32.encode(crypto.randomBytes(32)).toString().replace(/=/g,'') : null // remove padding
    };
  }

  @Get('user/:userid')
  @UseGuards(JwtAuthGuard)
  async user_profile(@Request() req, @Param() param: ParamUserProfile) {
    const user = await this.usersService.user({
      id: Number(param.userid),
    });
    if (!user) {
      throw new BadRequestException('Invalid user');
    }

    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar.replace(
        '://<<host>>',
        '://' + process.env.FRONT_HOST,
      ),
      ...(await this.usersService.getScore(user.id)),
      status: await this.usersService.getUserStatus(user),
      gameID: user.games[0] ? user.games[0].gameId : undefined, // usersService.user only returns games not ended
      achievements: user.achievements,
    };
  }

  @Get('user/:userid/games')
  @UseGuards(JwtAuthGuard)
  async played_games(@Request() req, @Param() param: ParamUserProfile)
  {
    return this.usersService.getPlayedGames(param.userid);
  }

  @Post('user/avatar-upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Request() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 420000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  )
  {
    if (!file.mimetype.match(/^image\/(bmp|gif|jpeg|jpg|png|webp)$/))
      return { error: 1 };
    const ext = file.mimetype.replace(/^image\//, '.');
    this.usersService.uploadImageInPsql({
      name: req.user.id + ext,
      content: file.buffer,
    });
    const hash = +new Date();
    await this.usersService.updateUser({
      where: {
        login: req.user.login,
      },
      data: {
        avatar:
          'http://<<host>>:8190/user/avatar/' +
          req.user.id +
          ext +
          '?' +
          hash,
      },
    });
    this.usersService.addAchivement({login: req.user.login},
      {primary: "Salut mes petites beautés !", secondary: "Changez votre avatar"});
    return { upload: 1 };
  }

  @Get('user/avatar/:filename')
  async rootAvatar(
    @Request() req,
    @Response({ passthrough: true }) resp,
    @Param() param: ParamFileInPsql,
  ): Promise<StreamableFile> {
    const file = await this.usersService.image({
      name: param.filename,
    });
    if (!file) {
      throw new BadRequestException('Invalid file');
    }
    resp.set('Content-Type', file.name.replace(/^(.*)\./, 'image/'));
    return new StreamableFile(file.content);
  }

  // Returns a pure string, containing new name, or original name if new one is illegal
  @Post('user/change-name')
  @UseGuards(JwtAuthGuard)
  async change_name(@Request() req, @Body() data: NewNameDTO)
  {
    const newName = data.newName.trim();
    if (newName.length < 2 || newName.length > 32)
      return req.user.name;
    
    try {
      const updatedUser = await this.usersService.updateUser({
        where: {id: req.user.id},
        data: {name: newName},
      });
      this.usersService.addAchivement({id: req.user.id},
        {primary: "SAY MY NAME", secondary: "Changez votre nom"});
      return updatedUser.name;
    }
    catch (err) {
      throw new BadRequestException();
    }
  }

  @Get('user/best/:limit')
  async get_best_players(@Param() params: ParamBestUsersLimit)
  {
    return this.usersService.getBestPlayers(+params.limit);
  }
}
