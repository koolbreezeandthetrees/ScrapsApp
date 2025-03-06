CREATE TABLE "color" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color_code" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ingredient" ADD COLUMN "color_id" integer;--> statement-breakpoint
ALTER TABLE "ingredient" DROP COLUMN "color";