import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { Classroom } from "@/common/entities/classrooms.entity";
import { Message } from "@/common/entities/messages.entity";
import { User } from "@/common/entities/users.entity";
import { GlobalChatModule } from "@/GlobalChat/GlobalChat.module";

import { MessagesController } from "./messages.controller";
import { MessagesSerializer } from "./messages.serializer";
import { MessagesService } from "./messages.service";

@Module({
  imports: [MikroOrmModule.forFeature([User, Message, Classroom]), GlobalChatModule],
  providers: [MessagesService, MessagesSerializer],
  controllers: [MessagesController],
})
export class MessagesModule {}
