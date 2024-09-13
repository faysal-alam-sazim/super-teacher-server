import { Injectable } from "@nestjs/common";

import { EntityRepository } from "@mikro-orm/postgresql";

import { Resource } from "@/common/entities/resources.entity";

@Injectable()
export class ResourcesRepository extends EntityRepository<Resource> {}
