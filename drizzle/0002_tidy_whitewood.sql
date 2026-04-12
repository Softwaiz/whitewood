CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`description` text,
	`image` text,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users` ADD `role` text DEFAULT 'member' NOT NULL;
--> statement-breakpoint
ALTER TABLE `users` ADD `organization_id` text REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action;
