import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { promptId: string } }
) {
  try {
    if (!params.promptId) {
      return new NextResponse("Prompt id is required", { status: 400 });
    }

    const response = await prismadb.response.findUnique({
      where: {
        id: params.promptId
      }
    });
  
    return NextResponse.json(response);
  } catch (error) {
    console.log('[RESPONSE_GET]', error);
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

    if (!params.promptId || !params.sessionId) {
      return new NextResponse("Prompt id and Session id are required", { status: 400 });
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

    const response = await prismadb.response.delete({
      where: {
        id: params.promptId
      }
    });
  
    return NextResponse.json(response);
  } catch (error) {
    console.log('[RESPONSE_DELETE]', error);
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

    const {
      content,
      temperature,
      top_p,
      stop,
      max_tokens,
      presence_penalty,
      frequency_penalty
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    if (!params.promptId || !params.sessionId) {
      return new NextResponse("Prompt id and Session id are required", { status: 400 });
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

    const updatedResponse = await prismadb.response.update({
      where: {
        id: params.promptId
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
  
    return NextResponse.json(updatedResponse);
  } catch (error) {
    console.log('[RESPONSE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};