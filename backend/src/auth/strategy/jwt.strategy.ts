import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')!,
    });
  }

  /**
   * Revérifie l'utilisateur en base à partir du payload du JWT
   *
   * @param payload Contenu décodé du token
   * @returns L'utilisateur (sans mot de passe), attaché à `req.user`
   * @throws {UnauthorizedException} Utilisateur introuvable
   */
  async validate(payload: { userId: number }) {
    const user = await this.usersService.findUniqueById(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
