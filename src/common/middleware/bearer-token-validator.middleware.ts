import { UnauthorizedException } from "@nestjs/common";

import { IncomingHttpHeaders } from "http";

export default function extractBearerAuthTokenFromHeaders(
  headers: Record<string, string> | IncomingHttpHeaders,
) {
  const bearerToken = headers?.authorization?.split(" ");

  if (!bearerToken || bearerToken[0] !== "Bearer" || !bearerToken[1]) {
    throw new UnauthorizedException();
  }

  const token = bearerToken[1];

  return token;
}
