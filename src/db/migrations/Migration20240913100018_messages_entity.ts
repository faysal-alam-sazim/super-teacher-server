import { Migration } from '@mikro-orm/migrations';

export class Migration20240913100018_messages_entity extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "message" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "message" varchar(255) not null, "attachment_url" varchar(255) null, "sender_id" int not null, "classroom_id" int not null);');

    this.addSql('alter table "message" add constraint "message_sender_id_foreign" foreign key ("sender_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "message" add constraint "message_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "message" cascade;');
  }

}
