import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

type MessageRole = "function" | "user" | "system" | "assistant";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { category, text, systemMessageContent, temperature, max_tokens, top_p, model } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    const systemMessage: { role: MessageRole, content: string } = {
      role: 'system',
      content: systemMessageContent || 'You are skilled at extracting information and providing concise answeers'
    };

    const extractTask: { role: MessageRole, content: string } = {
      role: "user",
      content: `Review the following text. Identify all the ${category} in the text below \n\n Text: ${text}`
    };

    const messages = [systemMessage, extractTask];

    const response = await openai.chat.completions.create({
      model: model || "gpt-3.5-turbo-0613",
      messages,
      temperature: temperature || 0.25,
      max_tokens: max_tokens || 150,
      top_p: top_p || 1,
    });

    return NextResponse.json(response.choices[0].message);

  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
