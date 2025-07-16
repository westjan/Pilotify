import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/bookmarks - Get all bookmarks for the authenticated user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id as string },
      include: {
        offer: {
          select: {
            id: true,
            title: true,
            description: true,
            category: { select: { name: true } },
            price: true,
            owner: { select: { companyName: true, name: true } },
          },
        },
        pilotProject: {
          select: {
            id: true,
            title: true,
            description: true,
            corporate: { select: { name: true } },
            innovator: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookmarks, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/bookmarks - Add a bookmark
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { offerId, pilotProjectId } = await request.json();

    if (!offerId && !pilotProjectId) {
      return NextResponse.json({ message: 'Either offerId or pilotProjectId is required' }, { status: 400 });
    }
    if (offerId && pilotProjectId) {
      return NextResponse.json({ message: 'Cannot bookmark both an offer and a pilot project at once' }, { status: 400 });
    }

    const data: any = { userId: session.user.id as string };
    if (offerId) data.offerId = offerId;
    if (pilotProjectId) data.pilotProjectId = pilotProjectId;

    const newBookmark = await prisma.bookmark.create({
      data,
    });

    return NextResponse.json(newBookmark, { status: 201 });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
