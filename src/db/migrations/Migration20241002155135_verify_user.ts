import { Migration } from "@mikro-orm/migrations";

export class Migration20241002155135_verify_user extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "verify_users" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "otp" varchar(255) not null, "expires_at" timestamptz not null, "status" text check ("status" in (\'ACTIVE\', \'EXPIRED\')) not null, "is_checked" boolean not null default false, "user_id" int null);',
    );

    this.addSql(
      'alter table "verify_users" add constraint "verify_users_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "verify_users" cascade;');
  }
}
