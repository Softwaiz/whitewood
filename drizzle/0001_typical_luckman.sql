ALTER TABLE `users` ADD `password` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `google_auth_email` text;--> statement-breakpoint
ALTER TABLE `users` ADD `google_auth_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_auth_email_unique` ON `users` (`google_auth_email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_auth_id_unique` ON `users` (`google_auth_id`);