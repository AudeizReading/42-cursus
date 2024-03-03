import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class Api42AuthGuard extends AuthGuard('api42') {
  handleRequest(err, user, info, context, status) {
    if (err || !user) {
      const req = context.getRequest();
      if (req.route.path == '/auth/callback') {
        context.getResponse().status(401).send(`<title>Transcendence</title>
          <h1>${req.query.error || 'Reessayez'}</h1><p>${
          req.query.error_description || "Refus de l'API 42"
        }</p>
          <script>setTimeout(() => window.close(), 10000);setTimeout(() => location = '/', 15000)</script>`);
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
