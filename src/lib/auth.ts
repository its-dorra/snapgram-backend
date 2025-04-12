import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db from "@/db";
import * as schema from "@/db/schema";
import { resend } from "@/lib/resend";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      "snapgram-user": schema.users,
      "snapgram-session": schema.sessions,
      "snapgram-account": schema.accounts,
      "snapgram-verification": schema.verifications,
    },
  }),
  trustedOrigins: ["http://localhost:3001"],
  user: {
    modelName: "snapgram-user",
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
      followingCount: {
        type: "number",
        min: 0,
        defaultValue: 0,
      },
      followerCount: {
        type: "number",
        min: 0,
        defaultValue: 0,
      },
    },
  },
  session: {
    modelName: "snapgram-session",
  },
  account: {
    modelName: "snapgram-account",
  },
  verification: {
    modelName: "snapgram-verification",
  },
  appName: "snapgram",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: user.email,
          subject: "Verify your email address",
          text: `Click the link to verify your email: ${url}`,
        });
      }
      catch (error) {
        console.log(error);
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
});
