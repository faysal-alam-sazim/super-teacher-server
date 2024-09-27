import { Migration } from "@mikro-orm/migrations";

export class Migration20240927122838_cascade_classroom_delete extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "resources" drop constraint "resources_classroom_id_foreign";');

    this.addSql('alter table "exams" drop constraint "exams_classroom_id_foreign";');

    this.addSql(
      'alter table "classroom_student" drop constraint "classroom_student_classroom_id_foreign";',
    );

    this.addSql(
      'alter table "assignment_submissions" drop constraint "assignment_submissions_assignment_id_foreign";',
    );

    this.addSql('alter table "message" drop constraint "message_classroom_id_foreign";');

    this.addSql(
      'alter table "resources" add constraint "resources_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "exams" add constraint "exams_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "classroom_student" add constraint "classroom_student_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "assignment_submissions" add constraint "assignment_submissions_assignment_id_foreign" foreign key ("assignment_id") references "assignments" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "message" add constraint "message_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade on delete cascade;',
    );

    this.addSql('alter table "assignments" drop constraint "assignments_classroom_id_foreign";');

    this.addSql(
      'alter table "assignments" add constraint "assignments_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "assignment_submissions" drop constraint "assignment_submissions_assignment_id_foreign";',
    );

    this.addSql(
      'alter table "classroom_student" drop constraint "classroom_student_classroom_id_foreign";',
    );

    this.addSql('alter table "exams" drop constraint "exams_classroom_id_foreign";');

    this.addSql('alter table "message" drop constraint "message_classroom_id_foreign";');

    this.addSql('alter table "resources" drop constraint "resources_classroom_id_foreign";');

    this.addSql(
      'alter table "assignment_submissions" add constraint "assignment_submissions_assignment_id_foreign" foreign key ("assignment_id") references "assignments" ("id") on update cascade on delete no action;',
    );

    this.addSql(
      'alter table "classroom_student" add constraint "classroom_student_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade on delete no action;',
    );

    this.addSql(
      'alter table "exams" add constraint "exams_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade on delete no action;',
    );

    this.addSql(
      'alter table "message" add constraint "message_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade on delete no action;',
    );

    this.addSql(
      'alter table "resources" add constraint "resources_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade on delete no action;',
    );

    this.addSql('alter table "assignments" drop constraint "assignments_classroom_id_foreign";');

    this.addSql(
      'alter table "assignments" add constraint "assignments_classroom_id_foreign" foreign key ("classroom_id") references "classrooms" ("id") on update cascade on delete no action;',
    );
  }
}
