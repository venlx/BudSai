import { query, mutation, type MutationCtx } from "./_generated/server";
import { v, ConvexError } from "convex/values";

async function requireUser(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("Unauthenticated");
  return identity.subject;
}

export const getAllTransactions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

export const addTransaction = mutation({
  args: {
    date: v.number(),
    category: v.id("categories"),
    value: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    return await ctx.db.insert("transactions", {
      userId,
      date: args.date,
      category: args.category,
      value: args.value,
      description: args.description,
    });
  },
});

export const updateTransaction = mutation({
  args: {
    id: v.id("transactions"),
    date: v.optional(v.number()),
    category: v.optional(v.id("categories")),
    value: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const tx = await ctx.db.get(args.id);
    if (!tx || tx.userId !== userId) throw new ConvexError("Not found");
    const patch: Record<string, unknown> = {};
    if (args.date !== undefined) patch.date = args.date;
    if (args.category !== undefined) patch.category = args.category;
    if (args.value !== undefined) patch.value = args.value;
    if (args.description !== undefined) patch.description = args.description;
    await ctx.db.patch(args.id, patch);
  },
});

export const removeTransaction = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const tx = await ctx.db.get(args.id);
    if (!tx || tx.userId !== userId) throw new ConvexError("Not found");
    await ctx.db.delete(args.id);
  },
});
