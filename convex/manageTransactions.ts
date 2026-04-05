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

export const removeTransaction = mutation({
  args: {
    id: v.id("transactions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
