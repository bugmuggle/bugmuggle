CREATE TYPE "public"."work_item_types" AS ENUM('task', 'bug');--> statement-breakpoint
CREATE TABLE "assign_story" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"story_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assign_work_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"work_item_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" serial NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" varchar(60),
	"created_by" serial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "story_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"work_item_id" serial NOT NULL,
	"story_id" serial NOT NULL,
	"created_by" serial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "work_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "work_item_types" DEFAULT 'task' NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"project_id" serial NOT NULL,
	"status" varchar(60),
	"created_by" serial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "project_memberships" ADD COLUMN "created_by" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "assign_story" ADD CONSTRAINT "assign_story_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assign_story" ADD CONSTRAINT "assign_story_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assign_work_items" ADD CONSTRAINT "assign_work_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assign_work_items" ADD CONSTRAINT "assign_work_items_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_items" ADD CONSTRAINT "story_items_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_items" ADD CONSTRAINT "story_items_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_items" ADD CONSTRAINT "story_items_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_memberships" ADD CONSTRAINT "project_memberships_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;