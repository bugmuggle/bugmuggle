CREATE TABLE "user_pref" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text,
	"value" text,
	"user_id" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "password_hash" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "user_pref" ADD CONSTRAINT "user_pref_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;