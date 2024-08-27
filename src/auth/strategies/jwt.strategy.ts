import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy } from "passport-jwt";

import { IJwtPayload, ITokenizedUser } from "@/auth/auth.interfaces";

import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: IJwtPayload): Promise<ITokenizedUser> {
    const user = await this.authService.checkUserExists(payload.sub);

    return {
      id: user.id,
      claim: user.role,
      firstName: user.firstName,
      email: user.email,
    };
  }
}
