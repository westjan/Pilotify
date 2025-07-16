import { NextResponse } from 'next/server';
import { PrismaClient, Role } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/reviews/[id] - Get a single review by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const review = await prisma.review.findUnique({
      where: { id },
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
        pilotProject: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/reviews/[id] - Update a review by ID (Reviewer or Admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { rating, comment, evaluationCriteria } = await request.json();

    const existingReview = await prisma.review.findUnique({ where: { id } });

    if (!existingReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    // Authorization: Only reviewer or Admin can update
    if (session.user?.role !== Role.ADMIN && existingReview.reviewerId !== session.user?.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating,
        comment,
        evaluationCriteria,
      },
    });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/reviews/[id] - Delete a review by ID (Reviewer or Admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const existingReview = await prisma.review.findUnique({ where: { id } });

    if (!existingReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    // Authorization: Only reviewer or Admin can delete
    if (session.user?.role !== Role.ADMIN && existingReview.reviewerId !== session.user?.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
