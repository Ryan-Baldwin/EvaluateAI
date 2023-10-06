import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs";

import prismadb from '@/lib/prismadb';

export async function POST(
    req: Request,
)   {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { userMessage, systemMessage } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!userMessage) {
      return new NextResponse("User Message is required", { status: 400 });
    }

    const prompt = await prismadb.prompt.create({
      data: {
        userMessage,
        systemMessage,
        userId,
      }
    });
  
    return NextResponse.json(prompt);
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

