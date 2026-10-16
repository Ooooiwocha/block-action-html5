CREATE TABLE `replays` (
	`stage_id` integer PRIMARY KEY NOT NULL,
	`score_id` integer NOT NULL,
	`revision` text NOT NULL,
	`time` integer NOT NULL,
	`frames` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `stages` ADD `mode` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `stages` ADD `revision` text DEFAULT '' NOT NULL;