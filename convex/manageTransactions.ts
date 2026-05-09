import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllTransactions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("transactions").collect();
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
    const insertedId = await ctx.db.insert("transactions", {
      date: args.date,
      category: args.category,
      value: args.value,
      description: args.description,
    });
    return insertedId;
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
    const patch: Record<string, unknown> = {};
    if (args.date !== undefined) patch.date = args.date;
    if (args.category !== undefined) patch.category = args.category;
    if (args.value !== undefined) patch.value = args.value;
    if (args.description !== undefined) patch.description = args.description;
    await ctx.db.patch(args.id, patch);
  },
});

export const removeTransaction = mutation({
  args: {
    id: v.id("transactions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
