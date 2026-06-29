import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const QUESTIONS_BANK = [
  { fr: "Quel est ton souvenir préféré de nous ?", en: "What's your favourite memory of us?", theme: "love" },
  { fr: "Qu'est-ce qui te manque le plus quand on est loin ?", en: "What do you miss most when we're apart?", theme: "distance" },
  { fr: "Si on pouvait se téléporter quelque part maintenant, où irais-tu ?", en: "If we could teleport somewhere right now, where would you go?", theme: "dreams" },
  { fr: "Qu'est-ce que tu voudrais qu'on fasse à nos prochaines retrouvailles ?", en: "What do you want us to do at our next reunion?", theme: "plans" },
  { fr: "Quel petit geste de moi te rend le plus heureux/heureuse ?", en: "What small gesture of mine makes you happiest?", theme: "love" },
  { fr: "Comment tu décrirais notre couple en 3 mots ?", en: "How would you describe our relationship in 3 words?", theme: "love" },
  { fr: "Qu'est-ce que la distance t'a appris sur nous ?", en: "What has distance taught you about us?", theme: "distance" },
  { fr: "Quel projet futur te motive le plus pour nous ?", en: "What future plan motivates you most for us?", theme: "plans" },
  { fr: "Quelle chanson te fait penser à moi ?", en: "What song makes you think of me?", theme: "daily" },
  { fr: "De quoi rêves-tu la nuit en ce moment ?", en: "What do you dream about at night lately?", theme: "desire" },
  { fr: "Qu'est-ce qu'on devrait essayer ensemble qu'on n'a jamais fait ?", en: "What should we try together that we've never done?", theme: "desire" },
  { fr: "Si tu pouvais revivre un de nos moments, lequel ?", en: "If you could relive one of our moments, which one?", theme: "memories" },
  { fr: "Comment tu imagines notre vie dans 5 ans ?", en: "How do you imagine our life in 5 years?", theme: "plans" },
  { fr: "Qu'est-ce que tu aurais aimé me dire la dernière fois qu'on s'est vus ?", en: "What do you wish you had told me last time we saw each other?", theme: "distance" },
  { fr: "Quel repas tu aimerais qu'on cuisine ensemble ?", en: "What meal would you like us to cook together?", theme: "daily" },
  { fr: "Comment tu gères les moments de manque ?", en: "How do you handle moments of missing me?", theme: "distance" },
  { fr: "Qu'est-ce qui te fait te sentir le plus aimé(e) ?", en: "What makes you feel most loved?", theme: "love" },
  { fr: "Si on avait un animal ensemble, lequel ?", en: "If we had a pet together, which one?", theme: "daily" },
  { fr: "Quel est ton fantasme de couple le plus fou ?", en: "What's your wildest couple fantasy?", theme: "desire" },
  { fr: "Comment tu voudrais qu'on célèbre notre prochain anniversaire ?", en: "How would you like to celebrate our next anniversary?", theme: "plans" },
];

function getQuestionOfDay(date: string): (typeof QUESTIONS_BANK)[number] {
  const dayIndex = Math.abs(hashCode(date)) % QUESTIONS_BANK.length;
  return QUESTIONS_BANK[dayIndex];
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

export const getToday = query({
  args: { coupleCode: v.string(), date: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("dailyQuestions"),
      _creationTime: v.number(),
      coupleCode: v.string(),
      date: v.string(),
      questionFr: v.string(),
      questionEn: v.string(),
      theme: v.string(),
      user1Answer: v.optional(v.string()),
      user2Answer: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dailyQuestions")
      .withIndex("by_couple_date", (q) =>
        q.eq("coupleCode", args.coupleCode).eq("date", args.date)
      )
      .first();
  },
});

export const answerQuestion = mutation({
  args: {
    coupleCode: v.string(),
    date: v.string(),
    userId: v.string(),
    answer: v.string(),
    isUser1: v.boolean(),
  },
  returns: v.id("dailyQuestions"),
  handler: async (ctx, args) => {
    let question = await ctx.db
      .query("dailyQuestions")
      .withIndex("by_couple_date", (q) =>
        q.eq("coupleCode", args.coupleCode).eq("date", args.date)
      )
      .first();

    if (!question) {
      const q = getQuestionOfDay(args.date);
      const id = await ctx.db.insert("dailyQuestions", {
        coupleCode: args.coupleCode,
        date: args.date,
        questionFr: q.fr,
        questionEn: q.en,
        theme: q.theme,
      });
      question = await ctx.db.get(id);
    }

    if (args.isUser1) {
      await ctx.db.patch(question!._id, { user1Answer: args.answer });
    } else {
      await ctx.db.patch(question!._id, { user2Answer: args.answer });
    }

    return question!._id;
  },
});
