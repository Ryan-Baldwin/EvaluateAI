import * as z from "zod";

export const formSchema = z.object(
  {
  prompt: z.string().min(1, {
    message: "Prompt is required."
  }),
  systemMessage: z.string().min(1, {
    message: "System prompt is required."
  }),
});
