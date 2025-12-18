PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_markerImage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`markerId` text,
	`photoPath` text NOT NULL,
	`desc` text,
	`createdAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`markerId`) REFERENCES `marker`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_markerImage`("id", "userId", "markerId", "photoPath", "desc", "createdAt") SELECT "id", "userId", "markerId", "photoPath", "desc", "createdAt" FROM `markerImage`;--> statement-breakpoint
DROP TABLE `markerImage`;--> statement-breakpoint
ALTER TABLE `__new_markerImage` RENAME TO `markerImage`;--> statement-breakpoint
PRAGMA foreign_keys=ON;