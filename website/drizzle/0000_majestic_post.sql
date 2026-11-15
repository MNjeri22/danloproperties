CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`type` text NOT NULL,
	`property_id` text DEFAULT '' NOT NULL,
	`property_label` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`visit_date` text DEFAULT '' NOT NULL,
	`visit_time` text DEFAULT '' NOT NULL,
	`source_hash` text NOT NULL,
	`contacted_at` integer
);
--> statement-breakpoint
CREATE INDEX `enquiry_created_idx` ON `enquiries` (`created_at`);--> statement-breakpoint
CREATE INDEX `enquiry_source_idx` ON `enquiries` (`source_hash`,`created_at`);