import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const Input = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
});

export const runAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured (missing API key).");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const result = streamText({
        model: gateway("google/gemini-3.7-flash"),
        system: data.system,
        prompt: data.prompt,
      });
      return { text: await result.text };
    } catch (error) {
      const status = (error as { statusCode?: number; status?: number })?.statusCode ??
        (error as { status?: number })?.status;
      if (status === 402) {
        throw new Error("AI credits are exhausted. Please add credits in Lovable to continue.");
      }
      if (status === 429) {
        throw new Error("Too many requests right now. Please wait a moment and try again.");
      }
      throw new Error(
        error instanceof Error ? error.message : "The AI request failed. Please try again.",
      );
    }
  });
