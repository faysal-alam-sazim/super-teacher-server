import { Injectable } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/postgresql";

import { io, Socket } from "socket.io-client";

import { ClassroomsRepository } from "@/classrooms/classrooms.repository";
import { FileUploadsService } from "@/file-uploads/file-uploads.service";
import { EGatewayIncomingEvent } from "@/GlobalChat/GlobalChat.enums";
import { ISendMessagePayload } from "@/GlobalChat/GlobalChat.interfaces";
import { UsersRepository } from "@/users/users.repository";

import { CreateMessageDto } from "./messages.dto";
import { MessagesRepository } from "./messages.repository";

@Injectable()
export class MessagesService {
  private socket!: Socket;

  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly classroomsRepository: ClassroomsRepository,
    private readonly fileUploadsService: FileUploadsService,
    private readonly em: EntityManager,
  ) {}

  private initializeSocket(token: string) {
    this.socket = io(`http://localhost:${process.env.BE_WS_PORT}`, {
      path: "/ws",
      transports: ["websocket"],
      auth: {
        authorization: `Bearer ${token}`,
      },
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });
  }
  async addMessage(
    createMessageDto: CreateMessageDto,
    classroomId: number,
    token: string,
    file?: Express.Multer.File,
  ) {
    if (!this.socket || !this.socket.connected) {
      this.initializeSocket(token);
    }

    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const sender = await this.usersRepository.findOneOrFail({ id: createMessageDto.sender });

    if (file) {
      createMessageDto.attachmentUrl = await this.fileUploadsService.handleFileUpload(file);
    }

    const message = this.messagesRepository.create({
      ...createMessageDto,
      classroom: classroom.id,
    });

    await this.em.persistAndFlush(message);

    const payload: ISendMessagePayload = {
      message: createMessageDto.message,
      attachmentUrl: createMessageDto.attachmentUrl,
      classroomId: classroom.id,
      senderId: createMessageDto.sender,
      firstName: sender.firstName,
      lastName: sender.lastName,
      role: sender.role,
    };

    this.socket.emit(EGatewayIncomingEvent.SEND_MESSAGE, payload);

    return message;
  }

  async getMessages(classroomId: number) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const messages = await this.messagesRepository.find(
      { classroom: classroom.id },
      { populate: ["sender"] },
    );
    return messages;
  }
}
