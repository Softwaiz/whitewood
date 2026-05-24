CREATE TABLE `collections` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`description` text,
	`slug` text NOT NULL,
	`organization_id` text NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now', 'localtime')) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collections_slug_unique` ON `collections` (`slug`);--> statement-breakpoint
CREATE TABLE `post_collections` (
	`post_id` text NOT NULL,
	`collection_id` text NOT NULL,
	PRIMARY KEY(`post_id`, `collection_id`),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action
);
