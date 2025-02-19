import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const [type, credentials] = authHeader.split(' ');

    if (type !== 'Basic' || !credentials) {
      return false;
    }

    const decodedCredentials = Buffer.from(credentials, 'base64').toString('ascii');
    const [username, password] = decodedCredentials.split(':');

    const validUsername = this.configService.get<string>('authLogin');
    const validPassword = this.configService.get<string>('authPassword');

    return username === validUsername && password === validPassword;
  }
}
