import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { CategoryType } from "./constants";

export default defineSchema({
  transactions: defineTable({
    userId: v.string(),
    date: v.number(),
    category: v.id("categories"),
    value: v.number(),
    description: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  categories: defineTable({
    userId: v.string(),
    type: v.union(
      v.literal(CategoryType.Expense),
      v.literal(CategoryType.Income),
      v.literal(CategoryType.Bill),
      v.literal(CategoryType.Savings),
    ),
    name: v.string(),
    parent: v.optional(v.id("categories")),
    monthlyBudget: v.optional(v.number()),
  }).index("by_user", ["userId"]),
});
