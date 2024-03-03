import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { NotifService } from '../notif/notif.service';
import { JwtAuthGuard } from '../auth/jwt.authguard';

import { IsNumberString, IsDateString } from 'class-validator';

export class ParamId {
  @IsNumberString()
  id: number;
}

export class ParamDate {
  @IsDateString()
  date: string;
}

@Controller('notif')
export class NotifController {
  constructor(private notifService: NotifService) {}

  @Get('fake/:id')
  async make_fake_notif(@Param() param: ParamId) {
    this.notifService.createNotif(Number(param.id), {
      text:
        'Vous avez demander une fake notif la voici. ' +
        'Pour être un peu plus utile, si vous cliquez sur moi vous allez ' +
        'être redirigé sur votre profil.',
      url: '/user/' + Number(param.id),
    });
  }

  @Get('fake/msg/:id')
  async make_fake_message(@Param() param: ParamId) {
    this.notifService.createMsg(Number(param.id), {
      text: 'Fake message !',
    });
  }

  @Get('read_all/:date')
  @UseGuards(JwtAuthGuard)
  async read_all(@Request() req, @Param() param: ParamDate) {
    return {
      count: await this.notifService.readsNotif(
        req.user.id,
        new Date(param.date),
      ),
    };
  }

  @Get('read_last_msg/:date')
  @UseGuards(JwtAuthGuard)
  async delete_message(@Request() req, @Param() param: ParamDate) {
    return {
      count: await this.notifService.deleteNotifs({
        userId: req.user.id,
        createdAt: param.date,
        type: 'MSG',
      }),
    };
  }

  @Get('done_last_action/:date')
  @UseGuards(JwtAuthGuard)
  async delete_action(@Request() req, @Param() param: ParamDate) {
    return {
      count: await this.notifService.deleteNotifs({
        userId: req.user.id,
        createdAt: param.date,
        type: 'ACTION',
      }),
    };
  }

  @Get('delete/:id')
  @UseGuards(JwtAuthGuard)
  async delete_notif(@Request() req, @Param() param: ParamId)
  {
    console.log("delete request");
    return this.notifService.deleteNotifs({id: +param.id})
      .then(res => res.count);
  }
}
