import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type CoreMessage } from "ai";
import { env } from "~/env";

const Roles = z.enum(["system", "user", "assistant"]);

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const systemPrompt =
  "This is a detective game, you are the game master. The goal is to create a cool interactive experience for the player to solve. Here are the scenario. Please output plaintext only";

export const chatRouter = createTRPCRouter({
  chat: publicProcedure
    .input(
      z.object({
        prompts: z
          .array(z.object({ role: Roles, content: z.string().min(1) }))
          .min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const messages = [
        { role: "system", content: systemPrompt },
        ...input.prompts,
      ] as CoreMessage[];
      const res = await generateText({
        model: openai("gpt-4o-mini"),
        messages,
      });
      console.log(res);
      return res.text;
    }),
});
