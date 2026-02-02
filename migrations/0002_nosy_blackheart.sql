CREATE TABLE IF NOT EXISTS `plantGrowthRecords` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`markerId` text NOT NULL,
	`height` integer NOT NULL,
	`measuredAt` integer,
	`measuredBy` integer,
	`notes` text,
	FOREIGN KEY (`markerId`) REFERENCES `marker`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`measuredBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `plantHealthRecords` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`markerId` text NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	`recordedAt` integer,
	`recordedBy` integer,
	FOREIGN KEY (`markerId`) REFERENCES `marker`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recordedBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `plantTasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`markerId` text NOT NULL,
	`taskType` text NOT NULL,
	`dueDate` integer NOT NULL,
	`completedAt` integer,
	`priority` text,
	`notes` text,
	`createdBy` integer,
	`createdAt` integer,
	FOREIGN KEY (`markerId`) REFERENCES `marker`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `plantTreatments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`markerId` text NOT NULL,
	`type` text NOT NULL,
	`date` integer,
	`notes` text,
	`products` text,
	`performedBy` integer,
	`cost` integer,
	FOREIGN KEY (`markerId`) REFERENCES `marker`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`performedBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
