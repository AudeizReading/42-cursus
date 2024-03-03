import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User, MatchMaking, Game, PlayerGame } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: fromAuthHeaderOAsBearerToken,
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // also: fromUrlQueryParameter http://www.passportjs.org/packages/passport-jwt/
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { login: string, sessionid: string }) {
    if (!payload.login) {
      console.error('Malformed payload');
      return false;
    }
    const user = await this.usersService.user({
      login: payload.login,
    });
    if (!user || user.sessionid != payload.sessionid) {
      console.error('Invalid payload');
      return false;
    }
    // You can add user data in `req.user` for the controller
    return {
      id: user.id,
      login: payload.login,
      name: user.name,
      sessionid: payload.sessionid,
      doubleFA: user.doubleFA,
      avatar: user.avatar,
      mMaking: user.mMaking,
      isPlaying: user.games.length != 0,
      playingAt: (user.games || [])[0],
    };
  }
}

function parseAuthHeader(hdrValue) {
  // src: 'passport-jwt/lib/auth_header.js'
  if (typeof hdrValue !== 'string') {
    return null;
  }
  const matches = hdrValue.match(/(\S+)\s+(\S+)/);
  return matches && { scheme: matches[1], value: matches[2] };
}

// Inspired by: https://github.com/mikenicholson/passport-jwt/blob/96a6e5565ba5a6f3301d91959a0f646e54446388/lib/extract_jwt.js#L55
export function fromAuthHeaderOAsBearerToken(request: any) {
  // any => HTTP or websocket
  let token = null;
  const bool = request.headers && request.headers['authorization'];
  if (
    bool ||
    (request.handshake && request.handshake?.headers['authorization'])
  ) {
    const headers = bool ? request.headers : request.handshake.headers;
    const auth_params = parseAuthHeader(headers['authorization']);
    if (auth_params && 'bearer' === auth_params.scheme.toLowerCase()) {
      token = auth_params.value;
    }
  }
  return token;
}
