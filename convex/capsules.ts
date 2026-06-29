import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: { coupleCode: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("capsules"),
      _creationTime: v.number(),
      coupleCode: v.string(),
      fromUserId: v.string(),
      message: v.string(),
      unlockDate: v.string(),
      opened: v.boolean(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("capsules")
      .withIndex("by_couple", (q) => q.eq("coupleCode", args.coupleCode))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    coupleCode: v.string(),
    fromUserId: v.string(),
    message: v.string(),
    unlockDate: v.string(),
  },
  returns: v.id("capsules"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("capsules", {
      coupleCode: args.coupleCode,
      fromUserId: args.fromUserId,
      message: args.message,
      unlockDate: args.unlockDate,
      opened: false,
      createdAt: Date.now(),
    });
  },
});

export const open = mutation({
  args: { id: v.id("capsules") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { opened: true });
    return null;
  },
});
