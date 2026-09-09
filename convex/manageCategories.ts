import { query, mutation, type MutationCtx } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { CategoryType } from "./constants";

async function requireUser(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("Unauthenticated");
  return identity.subject;
}

export const getAllCategories = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();
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
    const userId = await requireUser(ctx);
    return await ctx.db.insert("categories", {
      userId,
      type: args.type,
      name: args.name,
      ...(args.parent && { parent: args.parent }),
      ...(args.monthlyBudget && { monthlyBudget: args.monthlyBudget }),
    });
  },
});

export const removeCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const cat = await ctx.db.get(args.id);
    if (!cat || cat.userId !== userId) throw new ConvexError("Not found");
    const subs = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("parent"), args.id))
      .collect();
    for (const sub of subs) {
      await ctx.db.delete(sub._id);
    }
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
    const userId = await requireUser(ctx);
    const cat = await ctx.db.get(args.id);
    if (!cat || cat.userId !== userId) throw new ConvexError("Not found");
    const patch: Record<string, unknown> = {};
    if (args.type !== undefined) patch.type = args.type;
    if (args.name !== undefined) patch.name = args.name;
    if (args.parent !== undefined) patch.parent = args.parent;
    if (args.monthlyBudget !== undefined) patch.monthlyBudget = args.monthlyBudget;
    await ctx.db.patch(args.id, patch);
  },
});
