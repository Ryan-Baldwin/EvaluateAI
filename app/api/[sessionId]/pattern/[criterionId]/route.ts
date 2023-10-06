import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { patternId: string } }
) {
  try {
    if (!params.patternId) {
      return new NextResponse("Criterion id is required", { status: 400 });
    }

    const pattern = await prismadb.pattern.findUnique({
      where: {
        id: params.patternId
      }
    });
  
    return NextResponse.json(pattern);
  } catch (error) {
    console.log('[CRITERION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { patternId: string, sessionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.patternId) {
      return new NextResponse("Criterion id is required", { status: 400 });
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

    const pattern = await prismadb.pattern.delete({
      where: {
        id: params.patternId
      }
    });
  
    return NextResponse.json(pattern);
  } catch (error) {
    console.log('[CRITERION_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { patternId: string, sessionId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, instructions, patterns, examples, score } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!instructions) {
      return new NextResponse("Instructions are required", { status: 400 });
    }

    if (!patterns) {
        return new NextResponse("At least one pattern is required", { status: 400 });
      }

    if (!params.patternId) {
      return new NextResponse("Criterion id is required", { status: 400 });
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

    const pattern = await prismadb.pattern.update({
      where: {
        id: params.patternId
      },
      data: {
        name,
        instructions,
        patterns,
        examples,
        score
      }
    });
  
    return NextResponse.json(pattern);
  } catch (error) {
    console.log('[CRITERION_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
