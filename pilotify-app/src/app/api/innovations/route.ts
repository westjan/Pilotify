import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const innovations = await prisma.innovation.findMany({
      include: {
        owner: true,
      },
    });

    return NextResponse.json(innovations, { status: 200 });
  } catch (error) {
    console.error('Error fetching innovations:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.INNOVATOR) {
      return NextResponse.json({ message: 'Unauthorized: Only innovators can add innovations.' }, { status: 403 });
    }

    const { title, description, category } = await request.json();

    if (!title) {
      return NextResponse.json({ message: 'Missing required field: title' }, { status: 400 });
    }

    console.log('Session user in innovations POST:', session?.user);
    console.log('Session user ID in innovations POST:', session?.user?.id);

    const newInnovation = await prisma.innovation.create({
      data: {
        title,
        description,
        category,
        owner: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json(newInnovation, { status: 201 });
  } catch (error) {
    console.error('Error creating innovation:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    // You might want to log the request body here as well, but be careful with sensitive data
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
