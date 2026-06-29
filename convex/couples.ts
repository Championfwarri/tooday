import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByCode = query({
  args: { code: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("couples"),
      _creationTime: v.number(),
      code: v.string(),
      user1Id: v.string(),
      user2Id: v.optional(v.string()),
      createdAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("couples")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();
  },
});

export const create = mutation({
  args: { code: v.string(), userId: v.string() },
  returns: v.id("couples"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("couples", {
      code: args.code,
      user1Id: args.userId,
      createdAt: Date.now(),
    });
  },
});

export const join = mutation({
  args: { code: v.string(), userId: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const couple = await ctx.db
      .query("couples")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();
    if (!couple) return false;
    if (couple.user2Id) return false;
    await ctx.db.patch(couple._id, { user2Id: args.userId });
    return true;
  },
});
