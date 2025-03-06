ALTER TABLE "ingredient" ALTER COLUMN "unit_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ingredient" ALTER COLUMN "color_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ingredient" ALTER COLUMN "category_ingredient_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe" ALTER COLUMN "category_recipe_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe" ALTER COLUMN "servings" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe_ingredient" ALTER COLUMN "unit_id" SET NOT NULL;