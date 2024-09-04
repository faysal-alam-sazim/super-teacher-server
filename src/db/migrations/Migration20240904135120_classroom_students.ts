import { Migration } from "@mikro-orm/migrations";

export class Migration20240904135120_classroom_students extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "classroom_student" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "classroom_id" int not null, "student_id" int not null);',
    );

    this.addSql(
      'alter table "classroom_student" add constraint "classroom_student_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "classroom_student" add constraint "classroom_student_student_id_foreign" foreign key ("student_id") references "students" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "classroom_student" cascade;');
  }
}
