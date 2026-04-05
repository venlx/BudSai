import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  transactions: defineTable({
    date: v.number(),
    category: v.id("categories"),
    value: v.number(),
    description: v.optional(v.string()),
  }),
});
