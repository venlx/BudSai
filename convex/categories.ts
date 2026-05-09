import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { CategoryType } from "./constants";

export default defineSchema({
  categories: defineTable({
    type: v.union(
      v.literal(CategoryType.Expense),
      v.literal(CategoryType.Income),
      v.literal(CategoryType.Bill),
      v.literal(CategoryType.Savings),
    ),
    parent: v.optional(v.id("categories")),
    name: v.string(),
    monthlyBudget: v.optional(v.number()),
  }),
});
