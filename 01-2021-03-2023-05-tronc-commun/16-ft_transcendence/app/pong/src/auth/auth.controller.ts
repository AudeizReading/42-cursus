import {
  Controller,
  Get,
  Request,
  Query,
  Post,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { encode } from 'html-entities';
import { Api42AuthGuard } from './api42.authguard';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtAuthGuard } from './jwt.authguard';
import { fromAuthHeaderOAsBearerToken } from '../auth/jwt.strategy';
import { UsersService } from '../users/users.service';

import { Param } from '@nestjs/common';
import { IsNumberString, IsString, IsAlpha } from 'class-validator';
import * as crypto from 'crypto';
import * as base32 from 'thirty-two';
import { totp } from 'notp';

// doc: https://blog.logrocket.com/social-logins-nestjs/

export class ParamLogin {
  @IsAlpha()
  login: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('fake/:login')
  async fakeLogin(@Request() req, @Param() param: ParamLogin) {
    let user = await this.usersService.user({
      login: param.login,
    });
    const sessionid = crypto.randomBytes(32).toString('base64');
    if (!user) {
      console.log('create user');
      await this.usersService.createUser({
        email: param.login + '@fake348004549.fr',
        login: param.login,
        name: param.login,
        avatar: 'http://<<host>>:3000/res/default_avatar.jpg',
        sessionid: sessionid,
      });
    } else {
      const refresh_av = user.avatar && user.avatar.indexOf('http') === 0;

      await this.usersService.updateUser({
        where: {
          login: param.login,
        },
        data: {
          sessionid: sessionid,
        },
      });
    }
    user = await this.usersService.user({
      login: param.login,
    });
    console.log('You are a fake king');
    return `<script>
      location = 'http://' + window.location.hostname + ':3000/auth'
        + '#bearer=${this.authService.getToken(param.login, sessionid)}';
    </script>`;
  }

  @Get('callback')
  @UseGuards(Api42AuthGuard)
  async authCallback(@Request() req) {
    console.log('You are the king'); // TODO: Remove this line
    const user = req.user;
    const doubleFA = (await this.usersService.user({
      login: user.login,
    })).doubleFA;
    if (!doubleFA || doubleFA === '') {
      return `
      <script>
        location = 'http://' + window.location.hostname + ':3000/auth'
          + '#bearer=${this.authService.getToken(user.login, user.sessionid)}';
      </script>`;
    }
    else
      return `
      <script>
        location = 'http://' + window.location.hostname + ':3000/auth'
          + '#surrogate=${this.authService.getSurrogate(user.login, user.sessionid)}';
      </script>`;
  }

  /*

      */

  @Post('login2fa')
  async login2fa(@Request() req, @Body() data: { code: string }) {
    try {
      const token = fromAuthHeaderOAsBearerToken(req);
      const payload: any = await this.jwtService.decode(token);
      const user = await this.jwtStrategy.validate({
        login: payload.sLogin,
        sessionid: payload.sSessionid
      });
      const login = user && totp.verify(data.code, base32.decode(user.doubleFA));
      if (!login || Math.abs(login.delta) > 2) {
        return { success: false };
      }
      return {
        success: true,
        bearer: this.authService.getToken(user.login, user.sessionid),
      }
    } catch (e) {
      if (e.name !== 'JsonWebTokenError') console.error(e); // show other error
      return { success: false };
    }
  }

  @Get()
  @UseGuards(Api42AuthGuard)
  async login() {
    /* enable http://localhost/auth/ */
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    await this.usersService.updateUser({
      where: {
        id: req.user.id,
      },
      data: {
        sessionid: '',
      },
    });
  }

  // 2FA
  @Post('code2fa') // add or remove 2fa
  @UseGuards(JwtAuthGuard)
  async code2fa(@Request() req, @Body() data: { doubleFA: string | null, code: string }): Promise <{ success: boolean }>
  {
    /*BACK : https://github.com/guyht/notp */
    const activate = !(!req.user.doubleFA || req.user.doubleFA === '');
    const key = (activate) ? req.user.doubleFA : data.doubleFA;
    const login = totp.verify(data.code, base32.decode(key));
    if (!key || !login || Math.abs(login.delta) > 2 || (activate && base32.decode(key).length < 32)) {
      return { success: false };
    }
    await this.usersService.updateUser({
      where: {
        id: req.user.id,
      },
      data: {
        doubleFA: (activate) ? '' : key,
      },
    });
    return { success: true };
  }
}
