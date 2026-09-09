import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins/username";
import type { GenericDataModel } from "convex/server";
import { components } from "./_generated/api";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import authConfig from "./auth.config";

export const authComponent = createClient(components.betterAuth);

export const createAuth = (ctx: GenericCtx<GenericDataModel>) =>
  betterAuth({
    database: authComponent.adapter(ctx),
    trustedOrigins: [process.env.APP_URL ?? "http://localhost:3000"],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
    },
    plugins: [
      convex({ authConfig }),
      username(),
    ],
  });

export const { getAuthUser } = authComponent.clientApi();
