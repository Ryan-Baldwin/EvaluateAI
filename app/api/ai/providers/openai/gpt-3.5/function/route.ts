import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages, systemMessageContent, temperature, max_tokens, top_p } = body;  // Extracting system message from request body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const systemMessage = {
      role: 'system',
      content: systemMessageContent || 'Default system message'  // Use the provided system message or a default
    };

    const fullMessages = [systemMessage, ...messages];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages: fullMessages,
      temperature: temperature || 0.5,
      max_tokens: max_tokens || 150,
      top_p: top_p || 1
    });

    return NextResponse.json(response.choices[0].message);

  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
