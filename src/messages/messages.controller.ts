import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";

import { CreateMessageDto } from "./messages.dto";
import { MessagesService } from "./messages.service";

@Controller("classrooms")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(":id/messages")
  getMessages(@Param("id", ParseIntPipe) id: number) {
    return this.messagesService.getMessages(id);
  }

  @Post(":id/messages")
  addMessage(@Param("id", ParseIntPipe) id: number, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.addMessage(createMessageDto, id);
  }
}
