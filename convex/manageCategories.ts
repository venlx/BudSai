import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const addCategory = mutation({
  args: {
    expense: v.boolean(),
    name: v.string(),
    parent: v.optional(v.id("categories")),
    monthlyBudget: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const insertedId = await ctx.db.insert("categories", {
      expense: args.expense,
      name: args.name,
      ...(args.parent && { parent: args.parent }),
      ...(args.monthlyBudget && { monthlyBudget: args.monthlyBudget }),
    });
    return insertedId;
  },
});

export const removeCategory = mutation({
  args: {
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    // Find all subcategories linked to this main category
    const subs = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("parent"), args.id))
      .collect();
    // Delete each subcategory
    for (const sub of subs) {
      await ctx.db.delete(sub._id);
    }
    // Delete the main category
    await ctx.db.delete(args.id);
  },
});

export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    expense: v.optional(v.boolean()),
    name: v.optional(v.string()),
    parent: v.optional(v.id("categories")),
    monthlyBudget: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.expense) {
      await ctx.db.patch(args.id, { set: { expense: args.expense } });
    }
    if (args.name) {
      await ctx.db.patch(args.id, { set: { name: args.name } });
    }
    if (args.parent) {
      await ctx.db.patch(args.id, { set: { parent: args.parent } });
    }
    if (args.monthlyBudget) {
      await ctx.db.patch(args.id, {
        set: { monthlyBudget: args.monthlyBudget },
      });
    }
  },
});
