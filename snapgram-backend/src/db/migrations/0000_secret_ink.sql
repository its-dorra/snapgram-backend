CREATE TABLE "snapgram-accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "snapgram-sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "snapgram-sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "snapgram-users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"bio" text,
	CONSTRAINT "snapgram-users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "snapgram-verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "snapgram-likes" (
	"user_id" text NOT NULL,
	"post_id" uuid,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "snapgram-likes_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "snapgram-posts" (
	"post_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"imageUrl" text NOT NULL,
	"userId" text NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"location" text NOT NULL,
	"tags" text NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	"likesCount" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "snapgram-saved" (
	"user_id" text NOT NULL,
	"post_id" uuid,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "snapgram-saved_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "snapgram-accounts" ADD CONSTRAINT "snapgram-accounts_user_id_snapgram-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."snapgram-users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapgram-sessions" ADD CONSTRAINT "snapgram-sessions_user_id_snapgram-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."snapgram-users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapgram-likes" ADD CONSTRAINT "snapgram-likes_user_id_snapgram-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."snapgram-users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapgram-likes" ADD CONSTRAINT "snapgram-likes_post_id_snapgram-posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."snapgram-posts"("post_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapgram-posts" ADD CONSTRAINT "snapgram-posts_userId_snapgram-users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."snapgram-users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapgram-saved" ADD CONSTRAINT "snapgram-saved_user_id_snapgram-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."snapgram-users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapgram-saved" ADD CONSTRAINT "snapgram-saved_post_id_snapgram-posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."snapgram-posts"("post_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "like_user_idx" ON "snapgram-likes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "like_post_idx" ON "snapgram-likes" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_user_idx" ON "snapgram-posts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "saved_user_idx" ON "snapgram-saved" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saved_post_idx" ON "snapgram-saved" USING btree ("post_id");