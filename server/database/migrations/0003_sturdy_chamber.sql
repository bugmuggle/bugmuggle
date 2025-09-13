CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_by" serial NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;