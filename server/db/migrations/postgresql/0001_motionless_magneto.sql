CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" integer NOT NULL,
	"rootAdmin" boolean
);
--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_uid_users_id_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;