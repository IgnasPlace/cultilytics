CREATE TABLE IF NOT EXISTS `marker` (
	`id` text PRIMARY KEY NOT NULL,
	`lat` integer,
	`lng` integer,
	`type` text NOT NULL,
	`color` text NOT NULL,
	`name` text NOT NULL,
	`nameLatin` text,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `marker_id_unique` ON `marker` (`id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `markerImage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`markerId` text,
	`thumbnailPath` text NOT NULL,
	`mediumPath` text NOT NULL,
	`largePath` text NOT NULL,
	`desc` text,
	`createdAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`markerId`) REFERENCES `marker`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`email` text NOT NULL,
	`passwordHash` text NOT NULL,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);