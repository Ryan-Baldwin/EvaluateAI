import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { userMessage, systemMessage } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!userMessage) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    
    if (!params.sessionId) {
      return new NextResponse("Session id is required", { status: 400 });
    }

    const sessionByUserId = await prismadb.session.findFirst({
      where: {
        id: params.sessionId,
        userId
      }
    });

    if (!sessionByUserId) {
      return new NextResponse("Session not found or you don't have access", { status: 403 });
    }

    const prompt = await prismadb.prompt.create({
      data: {
        userMessage,
        systemMessage,
        sessionId: params.sessionId,
      },
    });

    // Assuming NextResponse.json is similar to res.json in Express
    return NextResponse.json(prompt); // This will include prompt.id
    
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}



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
        }
      });
    
      return NextResponse.json(prompt);
    } catch (error) {
      console.log('[PROMPT_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  
  export async function DELETE(
    req: Request,
    { params }: { params: { promptId: string, sessionId: string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!params.promptId) {
        return new NextResponse("Prompt id is required", { status: 400 });
      }
  
      const sessionByUserId = await prismadb.session.findFirst({
        where: {
          id: params.sessionId,
          userId
        }
      });
  
      if (!sessionByUserId) {
        return new NextResponse("Unauthorized", { status: 405 });
      }
  
      const prompt = await prismadb.prompt.delete({
        where: {
          id: params.promptId
        }
      });
    
      return NextResponse.json(prompt);
    } catch (error) {
      console.log('[PROMPT_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  
  
  export async function PATCH(
    req: Request,
    { params }: { params: { promptId: string, sessionId: string } }
  ) {
    try {
      const { userId } = auth();
  
      const body = await req.json();
  
      const {userMessage, systemMessage } = body;
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!userMessage) {
        return new NextResponse("User Message is required", { status: 400 });
      }
  
      if (!params.promptId) {
        return new NextResponse("Prompt id is required", { status: 400 });
      }
  
      const sessionByUserId = await prismadb.session.findFirst({
        where: {
          id: params.sessionId,
          userId
        }
      });
  
      if (!sessionByUserId) {
        return new NextResponse("Unauthorized", { status: 405 });
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