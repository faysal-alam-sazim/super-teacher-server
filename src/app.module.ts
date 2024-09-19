import { Logger, MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { OpenTelemetryModule } from "@metinseylan/nestjs-opentelemetry";

import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { ClassroomsModule } from "./classrooms/classrooms.module";
import { AppLoggerMiddleware } from "./common/middleware/request-logger.middleware";
import ormConfig from "./db/db.config";
import { ExamsModule } from "./exams/exams.module";
import { GlobalChatModule } from "./GlobalChat/GlobalChat.module";
import { MailModule } from "./mail/mail.module";
import { MessagesModule } from "./messages/messages.module";
import { ResourcesModule } from "./resources/resources.module";
import { StudentsModule } from "./students/students.module";
import { TeachersModule } from "./teachers/teachers.module";
import { UniqueCodeModule } from "./unique-code/unique-code.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    MikroOrmModule.forRoot(ormConfig),

    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
    }),

    OpenTelemetryModule.forRoot({
      serviceName: "Project Backend",
    }),
    UsersModule,
    AuthModule,
    JwtModule,
    StudentsModule,
    TeachersModule,
    UniqueCodeModule,
    ClassroomsModule,
    MailModule,
    MessagesModule,
    GlobalChatModule,
    ExamsModule,
    ResourcesModule,
  ],
  controllers: [],
  providers: [Logger, AuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes("*");
  }
}
