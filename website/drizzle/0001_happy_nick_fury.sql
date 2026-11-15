ALTER TABLE `enquiries` ADD `email_status` text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `email_provider_id` text;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `email_attempted_at` integer;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `email_attempts` integer DEFAULT 0 NOT NULL;