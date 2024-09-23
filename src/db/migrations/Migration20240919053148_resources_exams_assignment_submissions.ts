import { Migration } from "@mikro-orm/migrations";

export class Migration20240919053148_resources_exams_assignment_submissions extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "resources" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "file_url" varchar(255) not null, "description" varchar(255) not null, "classroom_id" int not null);',
    );

    this.addSql(
      'create table "exams" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "instruction" varchar(255) not null, "date" timestamptz not null, "classroom_id" int not null);',
    );

    this.addSql(
      'create table "assignments" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "description" varchar(255) not null, "file_url" varchar(255) not null, "due_date" timestamptz not null, "classroom_id" int not null);',
    );

    this.addSql(
      'create table "assignment_submissions" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "submitted_at" timestamptz not null, "file_url" varchar(255) not null, "assignment_id" int not null, "student_id" int not null);',
    );

    this.addSql(
      'alter table "resources" add constraint "resources_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "exams" add constraint "exams_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "assignments" add constraint "assignments_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "assignment_submissions" add constraint "assignment_submissions_assignment_id_foreign" foreign key ("assignment_id") references "assignments" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "assignment_submissions" add constraint "assignment_submissions_student_id_foreign" foreign key ("student_id") references "students" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "assignment_submissions" drop constraint "assignment_submissions_assignment_id_foreign";',
    );

    this.addSql('drop table if exists "resources" cascade;');

    this.addSql('drop table if exists "exams" cascade;');

    this.addSql('drop table if exists "assignments" cascade;');

    this.addSql('drop table if exists "assignment_submissions" cascade;');
  }
}
