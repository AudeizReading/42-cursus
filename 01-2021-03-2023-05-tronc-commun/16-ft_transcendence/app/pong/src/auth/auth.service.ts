import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  getToken(login: string, sessionid: string) {
    const payload = { login: login, sessionid: sessionid };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }

  getSurrogate(login: string, sessionid: string) {
    const payload = { sLogin: login, sSessionid: sessionid };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }

  /*getUser() {
    return this.jwtService.decode()
  }*/
}
