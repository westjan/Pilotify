import { NextResponse } from 'next/server';
import { PrismaClient, Role } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/reviews - Get all reviews for a specific pilot project
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

    const reviews = await prisma.review.findMany({
      where: { pilotProjectId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            profilePictureUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/reviews - Submit a new review
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { pilotProjectId, rating, comment, evaluationCriteria } = await request.json();

    if (!pilotProjectId || !rating) {
      return NextResponse.json({ message: 'Missing required fields: pilotProjectId, rating' }, { status: 400 });
    }

    // Check if the user is a participant in the project
    const pilotProject = await prisma.pilotProject.findUnique({
      where: { id: pilotProjectId },
      select: { corporateId: true, innovatorId: true, status: true },
    });

    if (!pilotProject) {
      return NextResponse.json({ message: 'Pilot project not found' }, { status: 404 });
    }

    if (pilotProject.status !== 'Completed') {
      return NextResponse.json({ message: 'Cannot review an uncompleted project' }, { status: 400 });
    }

    if (session.user?.id !== pilotProject.corporateId && session.user?.id !== pilotProject.innovatorId) {
      return NextResponse.json({ message: 'Forbidden: You can only review projects you participated in' }, { status: 403 });
    }

    // Prevent multiple reviews from the same user for the same project
    const existingReview = await prisma.review.findFirst({
      where: {
        pilotProjectId,
        reviewerId: session.user.id as string,
      },
    });

    if (existingReview) {
      return NextResponse.json({ message: 'You have already reviewed this project' }, { status: 409 });
    }

    const newReview = await prisma.review.create({
      data: {
        pilotProjectId,
        reviewerId: session.user.id as string,
        rating,
        comment,
        evaluationCriteria,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
