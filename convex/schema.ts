import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  couples: defineTable({
    code: v.string(),
    user1Id: v.string(),
    user2Id: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_code", ["code"]),

  dailyQuestions: defineTable({
    coupleCode: v.string(),
    date: v.string(),
    questionFr: v.string(),
    questionEn: v.string(),
    theme: v.string(),
    user1Answer: v.optional(v.string()),
    user2Answer: v.optional(v.string()),
  })
    .index("by_couple_date", ["coupleCode", "date"])
    .index("by_couple", ["coupleCode"]),

  missYou: defineTable({
    coupleCode: v.string(),
    fromUserId: v.string(),
    type: v.string(),
    createdAt: v.number(),
  }).index("by_couple", ["coupleCode"]),

  photos: defineTable({
    coupleCode: v.string(),
    userId: v.string(),
    date: v.string(),
    storageId: v.optional(v.string()),
    caption: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_couple_date", ["coupleCode", "date"])
    .index("by_couple", ["coupleCode"]),

  ourList: defineTable({
    coupleCode: v.string(),
    text: v.string(),
    completed: v.boolean(),
    createdAt: v.number(),
  }).index("by_couple", ["coupleCode"]),

  ourMoment: defineTable({
    coupleCode: v.string(),
    title: v.string(),
    scheduledAt: v.number(),
    createdAt: v.number(),
  }).index("by_couple", ["coupleCode"]),

  capsules: defineTable({
    coupleCode: v.string(),
    fromUserId: v.string(),
    message: v.string(),
    unlockDate: v.string(),
    opened: v.boolean(),
    createdAt: v.number(),
  }).index("by_couple", ["coupleCode"]),
});
