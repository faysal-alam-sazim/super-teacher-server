import { Migration } from "@mikro-orm/migrations";

export class Migration20240823100637_update_teacher_entity_type extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "unique_code" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "code" varchar(255) not null, "reset_counter" int not null);',
    );
    this.addSql(
      'alter table "unique_code" add constraint "unique_code_email_unique" unique ("email");',
    );
    this.addSql(
      'alter table "unique_code" add constraint "unique_code_code_unique" unique ("code");',
    );

    this.addSql(
      'create table "users" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "address" varchar(255) not null, "phone_number" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "gender" text check ("gender" in (\'Male\', \'Female\')) not null, "role" text check ("role" in (\'Student\', \'Teacher\')) not null);',
    );
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');

    this.addSql(
      'create table "teachers" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "highest_education_level" varchar(255) not null, "major_subject" varchar(255) not null, "subjects_to_teach" text[] not null, "user_id" int not null);',
    );
    this.addSql(
      'alter table "teachers" add constraint "teachers_user_id_unique" unique ("user_id");',
    );

    this.addSql(
      'create table "students" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "education_level" text check ("education_level" in (\'School\', \'College\', \'University\')) not null, "medium" text check ("medium" in (\'Bangla\', \'English\')) null, "class" varchar(255) null, "degree" text check ("degree" in (\'Bachelors\', \'Masters\')) null, "degree_name" varchar(255) null, "semester_year" varchar(255) null, "user_id" int not null);',
    );
    this.addSql(
      'alter table "students" add constraint "students_user_id_unique" unique ("user_id");',
    );

    this.addSql(
      'alter table "teachers" add constraint "teachers_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "students" add constraint "students_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "teachers" drop constraint "teachers_user_id_foreign";');

    this.addSql('alter table "students" drop constraint "students_user_id_foreign";');

    this.addSql('drop table if exists "unique_code" cascade;');

    this.addSql('drop table if exists "users" cascade;');

    this.addSql('drop table if exists "teachers" cascade;');

    this.addSql('drop table if exists "students" cascade;');
  }
}
