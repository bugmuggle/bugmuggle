CREATE TYPE "public"."project_membership_types" AS ENUM('admin', 'member', 'guest');--> statement-breakpoint
CREATE TABLE "project_memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "project_membership_types" DEFAULT 'member' NOT NULL,
	"user_id" serial NOT NULL,
	"project_id" serial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "project_memberships" ADD CONSTRAINT "project_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_memberships" ADD CONSTRAINT "project_memberships_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;