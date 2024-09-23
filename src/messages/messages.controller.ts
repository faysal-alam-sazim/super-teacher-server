import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { Request } from "express";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { ResponseTransformInterceptor } from "@/common/interceptors/response-transform.interceptor";
import extractBearerAuthTokenFromHeaders from "@/common/middleware/bearer-token-validator.middleware";

import { CreateMessageDto } from "./messages.dto";
import { MessagesSerializer } from "./messages.serializer";
import { MessagesService } from "./messages.service";

@UseInterceptors(ResponseTransformInterceptor)
@UseGuards(JwtAuthGuard)
@Controller("classrooms")
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesSerializer: MessagesSerializer,
  ) {}

  @Get(":id/messages")
  async getMessages(@Param("id", ParseIntPipe) id: number) {
    const messages = await this.messagesService.getMessages(id);
    return this.messagesSerializer.serializeMany(messages);
  }

  @Post(":id/messages")
  addMessage(
    @Param("id", ParseIntPipe) id: number,
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: Request,
  ) {
    const token = extractBearerAuthTokenFromHeaders(req.headers);
    return this.messagesService.addMessage(createMessageDto, id, token);
  }
}
