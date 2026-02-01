CREATE TABLE `plantExpenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`markerId` text NOT NULL,
	`category` text NOT NULL,
	`amount` integer NOT NULL,
	`date` integer,
	`description` text,
	`recordedBy` integer,
	`createdAt` integer,
	FOREIGN KEY (`markerId`) REFERENCES `marker`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recordedBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `plantYieldRecords` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`markerId` text NOT NULL,
	`harvestDate` integer,
	`quantity` integer NOT NULL,
	`unit` text NOT NULL,
	`quality` text,
	`notes` text,
	`recordedBy` integer,
	`createdAt` integer,
	FOREIGN KEY (`markerId`) REFERENCES `marker`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recordedBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
