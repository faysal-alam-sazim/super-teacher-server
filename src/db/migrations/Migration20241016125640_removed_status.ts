import { Migration } from "@mikro-orm/migrations";

export class Migration20241016125640_removed_status extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "verify_users" drop column "status";');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "verify_users" add column "status" text check ("status" in (\'ACTIVE\', \'EXPIRED\')) not null;',
    );
  }
}
