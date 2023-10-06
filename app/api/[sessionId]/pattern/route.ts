import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, instructions, patterns, score, examples } = body;

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
    
    if (!score) {
        return new NextResponse("At least one pattern is required", { status: 400 });
      }
    
    if (!examples) {
        return new NextResponse("At least one pattern is required", { status: 400 });
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
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const pattern = await prismadb.pattern.create({
      data: {
        name,
        instructions,
        patterns,
        sessionId: params.sessionId,
        examples,
        score
      }
    });
  
    return NextResponse.json(pattern);
  } catch (error) {
    console.log('[CRITERIONS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    if (!params.sessionId) {
      return new NextResponse("Session id is required", { status: 400 });
    }

    const criteria = await prismadb.pattern.findMany({
      where: {
        sessionId: params.sessionId
      }
    });
  
    return NextResponse.json(criteria);
  } catch (error) {
    console.log('[CRITERIONS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
