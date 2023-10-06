import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function PATCH(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.sessionId) {
      return new NextResponse("Session id is required", { status: 400 });
    }

    const session = await prismadb.session.updateMany({
      where: {
        id: params.sessionId,
        userId,
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(session);
  } catch (error) {
    console.log('[STORE_PATCH]', error);
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