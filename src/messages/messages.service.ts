import { Injectable } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/postgresql";

import { ClassroomsRepository } from "@/classrooms/classrooms.repository";

import { CreateMessageDto } from "./messages.dto";
import { MessagesRepository } from "./messages.repository";

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly classroomsRepository: ClassroomsRepository,
    private readonly em: EntityManager,
  ) {}

  async addMessage(createMessageDto: CreateMessageDto, classroomId: number) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const message = this.messagesRepository.create({
      ...createMessageDto,
      classroom: classroom.id,
    });

    await this.em.persistAndFlush(message);

    return message;
  }

  async getMessages(classroomId: number) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const messages = await this.messagesRepository.find({ classroom: classroom.id });

    return messages;
  }
}
