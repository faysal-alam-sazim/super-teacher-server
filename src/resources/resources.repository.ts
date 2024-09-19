import { Injectable } from "@nestjs/common";

import { EntityRepository } from "@mikro-orm/postgresql";

import { Resource } from "@/common/entities/resources.entity";

import { UpdateResourceDto } from "./resources.dtos";

@Injectable()
export class ResourcesRepository extends EntityRepository<Resource> {
  async updateOne(resource: Resource, resourceToUpdate: UpdateResourceDto) {
    this.assign(resource, resourceToUpdate);

    await this.em.persistAndFlush(resource);

    return resource;
  }
}
