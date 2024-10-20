import { Injectable } from "@nestjs/common";

import { AbstractBaseSerializer } from "@/common/serializers";
import { TSerializationOptions } from "@/common/serializers/abstract-base-serializer.types";

@Injectable()
export class AssignmentsSerializer extends AbstractBaseSerializer {
  protected serializeOneOptions: TSerializationOptions = {
    skipNull: true,
    forceObject: true,
    populate: ["submissions.student"],
  };

  protected serializeManyOptions: TSerializationOptions = {
    skipNull: true,
    forceObject: true,
    populate: ["submissions.student"],
  };
}
