CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"username" varchar(256),
	"login_type" varchar(50) DEFAULT 'email_password' NOT NULL,
	"profile_picture" varchar(256),
	"password" varchar(256) NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"refresh_token" varchar(256),
	"forgot_password_token" varchar(512),
	"forgot_password_token_expires_at" timestamp with time zone,
	"email_verification_token" varchar(512),
	"email_verification_expiry" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE INDEX "refresh_token_idx" ON "users" USING btree ("refresh_token");--> statement-breakpoint
CREATE INDEX "forgot_password_token_idx" ON "users" USING btree ("forgot_password_token");--> statement-breakpoint
CREATE INDEX "email_verification_token_idx" ON "users" USING btree ("email_verification_token");