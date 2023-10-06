import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function GET(
  req: Request,
  { params }: { params: { promptId: string } }
) {
  try {
    if (!params.promptId) {
      return new NextResponse("Prompt id is required", { status: 400 });
    }

    const prompt = await prismadb.prompt.findUnique({
      where: {
        id: params.promptId
      },
    });
  
    return NextResponse.json(prompt);
  } catch (error) {
    console.log('[PROMPT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: { promptId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { userMessage, systemMessage } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!userMessage) {
      return new NextResponse("Uswer Message is required", { status: 400 });
    }

    if (!params.promptId) {
      return new NextResponse("Prompt id is required", { status: 400 });
    }


    const prompt = await prismadb.prompt.update({
      where: {
        id: params.promptId
      },
      data: {
        userMessage,
        systemMessage
      }
    });
  
    return NextResponse.json(prompt);
  } catch (error) {
    console.log('[PROMPT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.sessionId) {
      return new NextResponse("Session id is required", { status: 400 });
    }

    const session = await prismadb.session.deleteMany({
      where: {
        id: params.sessionId,
        userId
      }
    });
  
    return NextResponse.json(session);
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};