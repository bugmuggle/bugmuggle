ALTER TABLE `task_attachments` ADD `file_path` text NOT NULL;--> statement-breakpoint
ALTER TABLE `task_attachments` DROP COLUMN `file_content`;