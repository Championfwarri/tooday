import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: {
    coupleCode: v.string(),
    fromUserId: v.string(),
    type: v.string(),
  },
  returns: v.id("missYou"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("missYou", {
      coupleCode: args.coupleCode,
      fromUserId: args.fromUserId,
      type: args.type,
      createdAt: Date.now(),
    });
  },
});

export const getRecent = query({
  args: { coupleCode: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("missYou"),
      _creationTime: v.number(),
      coupleCode: v.string(),
      fromUserId: v.string(),
      type: v.string(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("missYou")
      .withIndex("by_couple", (q) => q.eq("coupleCode", args.coupleCode))
      .order("desc")
      .take(20);
  },
});
