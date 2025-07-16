import { NextResponse } from 'next/server';
import { PrismaClient, Role } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/comments?pilotProjectId=... - Get comments for a specific pilot project
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pilotProjectId = searchParams.get('pilotProjectId');

    if (!pilotProjectId) {
      return NextResponse.json({ message: 'pilotProjectId is required' }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { pilotProjectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Process comments to include reaction counts and user's reaction status
    const processedComments = comments.map(comment => {
      const reactionCounts: { [key: string]: number } = {};
      const userReaction: { type: string, id: string } | null = null;

      comment.reactions.forEach(reaction => {
        reactionCounts[reaction.type] = (reactionCounts[reaction.type] || 0) + 1;
        // if (reaction.userId === session.user?.id) {
        //   userReaction = { type: reaction.type, id: reaction.id };
        // } // This logic needs to be handled carefully if multiple reactions are allowed
      });

      return {
        ...comment,
        reactionCounts,
        userReaction: comment.reactions.find(r => r.userId === session.user?.id) || null,
      };
    });

    return NextResponse.json(processedComments, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/comments - Submit a new comment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { pilotProjectId, text } = await request.json();

    if (!pilotProjectId || !text) {
      return NextResponse.json({ message: 'pilotProjectId and text are required' }, { status: 400 });
    }

    // Check if the user is a participant in the project
    const pilotProject = await prisma.pilotProject.findUnique({
      where: { id: pilotProjectId },
      select: { corporateId: true, innovatorId: true },
    });

    if (!pilotProject) {
      return NextResponse.json({ message: 'Pilot project not found' }, { status: 404 });
    }

    if (session.user?.id !== pilotProject.corporateId && session.user?.id !== pilotProject.innovatorId) {
      return NextResponse.json({ message: 'Forbidden: You can only comment on projects you participated in' }, { status: 403 });
    }

    const newComment = await prisma.comment.create({
      data: {
        pilotProjectId,
        userId: session.user.id as string,
        text,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error submitting comment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
