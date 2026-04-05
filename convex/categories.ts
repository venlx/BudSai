import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    expense: v.boolean(),
    parent: v.optional(v.id("categories")),
    name: v.string(),
    monthlyBudget: v.optional(v.number()),
  }),
});
