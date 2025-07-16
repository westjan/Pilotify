import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// DELETE /api/bookmarks/[id] - Remove a bookmark
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const existingBookmark = await prisma.bookmark.findUnique({
      where: { id },
    });

    if (!existingBookmark) {
      return NextResponse.json({ message: 'Bookmark not found' }, { status: 404 });
    }

    // Authorization: Only the user who created the bookmark can delete it
    if (existingBookmark.userId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.bookmark.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Bookmark removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
