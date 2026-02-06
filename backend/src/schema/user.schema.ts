import { varchar } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { index } from "drizzle-orm/pg-core";
import { uniqueIndex } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const User = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    username: varchar("username", { length: 256 }).unique(),
    loginType: varchar("login_type", { length: 50 })
      .$type<"email_password" | "google" | "github">()
      .default("email_password")
      .notNull(),
    profilePicture: varchar("profile_picture", { length: 256 }),
    password: varchar("password", { length: 256 }).notNull(),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    refreshToken: varchar("refresh_token", { length: 256 }),
    forgotPasswordToken: varchar("forgot_password_token", { length: 512 }),
    forgotPasswordTokenExpiresAt: timestamp(
      "forgot_password_token_expires_at",
      {
        mode: "date",
        withTimezone: true,
      },
    ),
    emailVerificationToken: varchar("email_verification_token", {
      length: 512,
    }),
    emailVerificationExpiry: timestamp("email_verification_expiry", {
      mode: "date",
      withTimezone: true,
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("refresh_token_idx").on(table.refreshToken),
    index("forgot_password_token_idx").on(table.forgotPasswordToken),
    index("email_verification_token_idx").on(table.emailVerificationToken),
  ],
);
