import { NextResponse } from 'next/server';
import { PrismaClient, Role } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// POST /api/comments/[commentId]/reactions - Add a reaction to a comment
export async function POST(request: Request, { params }: { params: { commentId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = params;
    const { type } = await request.json(); // e.g., 'like', 'heart', 'laugh'

    if (!type) {
      return NextResponse.json({ message: 'Reaction type is required' }, { status: 400 });
    }

    // Check if the user has already reacted with this type to this comment
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        commentId,
        userId: session.user.id as string,
        type,
      },
    });

    if (existingReaction) {
      return NextResponse.json({ message: 'Already reacted with this type' }, { status: 409 });
    }

    const newReaction = await prisma.reaction.create({
      data: {
        commentId,
        userId: session.user.id as string,
        type,
      },
    });

    return NextResponse.json(newReaction, { status: 201 });
  } catch (error) {
    console.error('Error adding reaction:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/comments/[commentId]/reactions/[reactionId] - Remove a reaction
export async function DELETE(request: Request, { params }: { params: { commentId: string, reactionId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { reactionId } = params;
    console.log('Received DELETE request for reactionId:', reactionId);

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
