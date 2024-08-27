import { Migration } from "@mikro-orm/migrations";

export class Migration20240902095944_classrooms extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "classrooms" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "subject" varchar(255) not null, "class_time" timestamptz not null, "days" text[] not null, "meet_link" varchar(255) null, "teacher_id" int not null);',
    );

    this.addSql(
      'alter table "classrooms" add constraint "classrooms_teacher_id_foreign" foreign key ("teacher_id") references "teachers" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "classrooms" cascade;');
  }
}
