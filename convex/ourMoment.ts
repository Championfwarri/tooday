import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: { coupleCode: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("ourMoment"),
      _creationTime: v.number(),
      coupleCode: v.string(),
      title: v.string(),
      scheduledAt: v.number(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ourMoment")
      .withIndex("by_couple", (q) => q.eq("coupleCode", args.coupleCode))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    coupleCode: v.string(),
    title: v.string(),
    scheduledAt: v.number(),
  },
  returns: v.id("ourMoment"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("ourMoment", {
      coupleCode: args.coupleCode,
      title: args.title,
      scheduledAt: args.scheduledAt,
      createdAt: Date.now(),
    });
  },
});
