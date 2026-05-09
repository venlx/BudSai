import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { CategoryType } from "./constants";

export const getAllCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const addCategory = mutation({
  args: {
    type: v.union(
      v.literal(CategoryType.Expense),
      v.literal(CategoryType.Income),
      v.literal(CategoryType.Bill),
      v.literal(CategoryType.Savings),
    ),
    name: v.string(),
    parent: v.optional(v.id("categories")),
    monthlyBudget: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const insertedId = await ctx.db.insert("categories", {
      type: args.type,
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
    type: v.optional(
      v.union(
        v.literal(CategoryType.Expense),
        v.literal(CategoryType.Income),
        v.literal(CategoryType.Bill),
        v.literal(CategoryType.Savings),
      ),
    ),
    name: v.optional(v.string()),
    parent: v.optional(v.id("categories")),
    monthlyBudget: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = {};
    if (args.type !== undefined) patch.type = args.type;
    if (args.name !== undefined) patch.name = args.name;
    if (args.parent !== undefined) patch.parent = args.parent;
    if (args.monthlyBudget !== undefined)
      patch.monthlyBudget = args.monthlyBudget;
    await ctx.db.patch(args.id, patch);
  },
});
