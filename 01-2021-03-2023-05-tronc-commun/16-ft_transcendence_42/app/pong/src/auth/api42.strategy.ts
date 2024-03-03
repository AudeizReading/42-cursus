import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-42';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';

// doc: https://blog.logrocket.com/social-logins-nestjs/

@Injectable()
export class Api42Strategy extends PassportStrategy(Strategy, 'api42') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.API_42_UID,
      clientSecret: process.env.API_42_SECRET,
      callbackURL: 'http://' + process.env.FRONT_HOST + ':8190/auth/callback',
      profileFields: {
        id: function (obj) {
          return String(obj.id);
        },
        username: 'login',
        email: 'email',
        avatar: 'image.link',
      },
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    const user = await this.usersService.user({
      login: profile.username,
    });
    const sessionid = crypto.randomBytes(32).toString('base64');
    if (!user) {
      console.log('create user');
      await this.usersService.createUser({
        email: profile.email,
        login: profile.username,
        name: profile.username,
        avatar: profile.avatar,
        sessionid: sessionid,
      });
    } else {
      const refresh_av = user.avatar && user.avatar.indexOf('http') === 0;

      await this.usersService.updateUser({
        where: {
          login: profile.username,
        },
        data: {
          avatar: refresh_av ? user.avatar : profile.avatar,
          sessionid: sessionid,
        },
      });
    }
    // console.log(profile); // <<== toutes les infos ici :)
    return {
      login: profile.username,
      sessionid: sessionid,
      api42: profile,
    };
  }
}
