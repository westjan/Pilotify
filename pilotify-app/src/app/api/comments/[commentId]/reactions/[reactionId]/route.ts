import { NextResponse } from 'next/server';
import { PrismaClient, Role } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// DELETE /api/comments/[commentId]/reactions/[reactionId] - Remove a reaction
export async function DELETE(request: Request, { params }: { params: { commentId: string, reactionId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { reactionId } = params;

    const existingReaction = await prisma.reaction.findUnique({
      where: { id: reactionId },
    });

    if (!existingReaction) {
      return NextResponse.json({ message: 'Reaction not found' }, { status: 404 });
    }

    // Authorization: Only the user who created the reaction or an Admin can delete it
    if (session.user?.role !== Role.ADMIN && existingReaction.userId !== session.user?.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.reaction.delete({
      where: { id: reactionId },
    });

    return NextResponse.json({ message: 'Reaction removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing reaction:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
