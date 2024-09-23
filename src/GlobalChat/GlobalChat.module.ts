import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { GlobalChatGateway } from "./GlobalChat.gateway";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_TOKEN_LIFETIME,
      },
    }),
  ],
  providers: [GlobalChatGateway],
  exports: [GlobalChatGateway],
})
export class GlobalChatModule {}
