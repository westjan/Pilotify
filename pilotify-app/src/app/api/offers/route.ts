import { NextResponse } from 'next/server';
import { PrismaClient, OfferStatus, Role } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/offers - Get all offers (or filtered)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const statusFilter = searchParams.get('status') as OfferStatus || '';

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) {
      whereClause.category = category;
    }
    if (statusFilter) {
      whereClause.status = statusFilter;
    }

    const offers = await prisma.offer.findMany({
      where: whereClause,
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

    return NextResponse.json(offers, { status: 200 });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/offers - Create a new offer (Innovator only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.INNOVATOR) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, category, price, duration, deliverables, contactEmail } = await request.json();

    if (!title || !description || !price || !duration || !deliverables || !contactEmail) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newOffer = await prisma.offer.create({
      data: {
        title,
        description,
        ownerId: session.user.id as string,
        category,
        price,
        duration,
        deliverables,
        contactEmail,
        status: OfferStatus.AVAILABLE, // Default status
      },
    });

    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
