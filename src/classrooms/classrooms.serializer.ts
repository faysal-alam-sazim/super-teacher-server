import { Injectable } from "@nestjs/common";

import { AbstractBaseSerializer } from "@/common/serializers";
import { TSerializationOptions } from "@/common/serializers/abstract-base-serializer.types";

@Injectable()
export class ClassroomsSerializer extends AbstractBaseSerializer {
  protected serializeOneOptions: TSerializationOptions = {
    skipNull: true,
    forceObject: true,
    exclude: ["user.password", "user.student", "teacher.user.password"],
    populate: ["user", "classroomId.classroom", "teacher.user"],
  };

  protected serializeManyOptions: TSerializationOptions = {
    skipNull: true,
    forceObject: true,
    exclude: ["user.password", "user.student"],
    populate: ["user", "classroomId.classroom"],
  };
}
