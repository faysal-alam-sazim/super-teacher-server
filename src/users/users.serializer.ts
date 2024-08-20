import { Injectable } from "@nestjs/common";

import { AbstractBaseSerializer } from "@/common/serializers";
import { TSerializationOptions } from "@/common/serializers/abstract-base-serializer.types";

@Injectable()
export class UsersSerializer extends AbstractBaseSerializer {
  protected serializeOneOptions: TSerializationOptions = {
    skipNull: true,
    forceObject: true,
    exclude: ["password", "student.user"],
  };

  protected serializeManyOptions: TSerializationOptions = {
    skipNull: true,
    forceObject: true,
    exclude: ["password"],
  };
}
