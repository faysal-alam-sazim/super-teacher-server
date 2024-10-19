import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";

import { getCorsConfig } from "@/common/config/cors.config";
import extractBearerAuthTokenFromHeaders from "@/common/middleware/bearer-token-validator.middleware";
import { AbstractWebsocketGateway } from "@/common/websockets/abstract-websocket.gateway";
import { TSocket } from "@/common/websockets/abstract-websocket.types";

import { EGatewayIncomingEvent, EGatewayOutgoingEvent } from "./GlobalChat.enums";
import { ISendMessagePayload } from "./GlobalChat.interfaces";

@WebSocketGateway(Number(process.env.BE_WS_PORT), {
  cors: getCorsConfig(),
  path: "/ws",
  transports: ["websocket"],
})
export class GlobalChatGateway extends AbstractWebsocketGateway {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  private userIdToSocketMap: Map<number, TSocket> = new Map();

  onModuleInit(): void {
    super.onModuleInit();

    if (this.server) {
      this.server.use((socket: TSocket, next) => {
        const headers = socket.handshake.auth;
        const token = extractBearerAuthTokenFromHeaders(headers);

        try {
          const payload = this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET,
            ignoreExpiration: false,
            ignoreNotBefore: false,
          });
          socket.userId = payload.sub;

          return next();
        } catch (err) {
          return next(new UnauthorizedException());
        }
      });
    }
  }

  processNewConnection(socket: TSocket): void {
    const userId = socket.userId;

    if (userId) {
      this.userIdToSocketMap.set(userId, socket);
    }
  }

  emitPayloadToRoom<TPayload>(room: string, event: string, payload: TPayload): void {
    this.server.to(room).emit(event, payload);
  }

  emitPayloadForEvent<TPayload>(event: string, payload: TPayload): void {
    this.server.emit(event, payload);
  }

  @SubscribeMessage(EGatewayIncomingEvent.JOIN_CLASSROOM)
  handleJoinClassroom(
    @ConnectedSocket() socket: TSocket,
    @MessageBody() classroomId: number,
  ): void {
    socket.join(`classroom_${classroomId}`);
    console.log(`UserId ${socket.userId} joined classromm_${classroomId}`);
  }

  @SubscribeMessage(EGatewayIncomingEvent.SEND_MESSAGE)
  handleSendMessage(@MessageBody() message: ISendMessagePayload): void {
    const classroomRoom = `classroom_${message.classroomId}`;
    const payload = {
      classroom: message.classroomId,
      message: message.message,
      attachmentUrl: message.attachmentUrl,
      createdAt: new Date().toISOString(),
      sender: {
        id: message.senderId,
        firstName: message.firstName,
        lastName: message.lastName,
        role: message.role,
      },
    };

    this.emitPayloadToRoom(classroomRoom, EGatewayOutgoingEvent.RECEIVE_MESSAGE, payload);
  }
}
