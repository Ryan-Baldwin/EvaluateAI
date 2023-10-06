import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { promptId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { content, temperature, top_p, stop, max_tokens, presence_penalty, frequency_penalty } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.promptId) {
      return new NextResponse("Prompt id is required", { status: 400 });
    }

    if (!content) {
      return new NextResponse("Response content is required", { status: 400 });
    }

    const response = await prismadb.response.create({
      data: {
        content,
        temperature,
        top_p,
        stop,
        max_tokens,
        presence_penalty,
        frequency_penalty,
        promptId: params.promptId  // Associating the response with the given prompt
      },
    });
  
    return NextResponse.json(response);
  } catch (error) {
    console.log('[RESPONSE_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function GET(
    req: Request,
    { params }: { params: { responseId: string } }
  ) {
    try {
      if (!params.responseId) {
        return new NextResponse("Response id is required", { status: 400 });
      }
  
      const response = await prismadb.response.findUnique({
        where: {
          id: params.responseId
        },
        include: {
          prompt: true,
        }
      });
    
      return NextResponse.json(response);
    } catch (error) {
      console.log('[PROMPT_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  
  export async function DELETE(
    req: Request,
    { params }: { params: { responseId: string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!params.responseId) {
        return new NextResponse("Response id is required", { status: 400 });
      }

  
      const response = await prismadb.response.delete({
        where: {
          id: params.responseId
        }
      });
    
      return NextResponse.json(response);
    } catch (error) {
      console.log('[PROMPT_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  
  
  export async function PATCH(
    req: Request,
    { params }: { params: { responseId: string } }
  ) {
    try {
      const { userId } = auth();
  
      const body = await req.json();
  
      const {content, temperature, top_p, stop, max_tokens, presence_penalty, frequency_penalty, promptId } = body;
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!content) {
        return new NextResponse("content", { status: 400 });
      }
  
      if (!params.responseId) {
        return new NextResponse("Response id is required", { status: 400 });
      }
  
      const response = await prismadb.response.update({
        where: {
          id: params.responseId
        },
        data: {
          content,
          temperature, 
          top_p, 
          stop, 
          max_tokens, 
          presence_penalty, 
          frequency_penalty 
        }
      });
    
      return NextResponse.json(response);
    } catch (error) {
      console.log('[PROMPT_PATCH]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };