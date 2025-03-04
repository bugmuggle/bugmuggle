CREATE TABLE `task_attachments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_id` integer,
	`file_name` text NOT NULL,
	`file_size` integer NOT NULL,
	`file_type` text NOT NULL,
	`file_content` blob NOT NULL,
	`uploaded_by` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
