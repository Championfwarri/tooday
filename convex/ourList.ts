import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: { coupleCode: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("ourList"),
      _creationTime: v.number(),
      coupleCode: v.string(),
      text: v.string(),
      completed: v.boolean(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ourList")
      .withIndex("by_couple", (q) => q.eq("coupleCode", args.coupleCode))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: { coupleCode: v.string(), text: v.string() },
  returns: v.id("ourList"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("ourList", {
      coupleCode: args.coupleCode,
      text: args.text,
      completed: false,
      createdAt: Date.now(),
    });
  },
});

export const toggle = mutation({
  args: { id: v.id("ourList") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) return null;
    await ctx.db.patch(args.id, { completed: !item.completed });
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("ourList") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
