ALTER TABLE "password_hash" DROP CONSTRAINT "password_hash_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_pref" DROP CONSTRAINT "user_pref_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "password_hash" ADD CONSTRAINT "password_hash_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_pref" ADD CONSTRAINT "user_pref_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;