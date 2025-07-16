import { NextResponse } from 'next/server';
import { PrismaClient, OfferStatus, Role } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/offers/[id] - Get a single offer by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            companyLogoUrl: true,
          },
        },
      },
    });

    if (!offer) {
      return NextResponse.json({ message: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json(offer, { status: 200 });
  } catch (error) {
    console.error('Error fetching offer:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/offers/[id] - Update an offer by ID (Innovator or Admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { title, description, category, price, duration, deliverables, status, contactEmail } = await request.json();

    const existingOffer = await prisma.offer.findUnique({ where: { id } });

    if (!existingOffer) {
      return NextResponse.json({ message: 'Offer not found' }, { status: 404 });
    }

    // Authorization: Only owner or Admin can update
    if (session.user?.role !== Role.ADMIN && existingOffer.ownerId !== session.user?.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: {
        title,
        description,
        category,
        price,
        duration,
        deliverables,
        status,
        contactEmail,
      },
    });

    return NextResponse.json(updatedOffer, { status: 200 });
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/offers/[id] - Delete an offer by ID (Innovator or Admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const existingOffer = await prisma.offer.findUnique({ where: { id } });

    if (!existingOffer) {
      return NextResponse.json({ message: 'Offer not found' }, { status: 404 });
    }

    // Authorization: Only owner or Admin can delete
    if (session.user?.role !== Role.ADMIN && existingOffer.ownerId !== session.user?.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.offer.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Offer deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
