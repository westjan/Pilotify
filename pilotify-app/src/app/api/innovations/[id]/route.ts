import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const innovation = await prisma.innovation.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!innovation) {
      return NextResponse.json({ message: 'Innovation not found' }, { status: 404 });
    }

    return NextResponse.json(innovation, { status: 200 });
  } catch (error) {
    console.error('Error fetching innovation:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.INNOVATOR) {
      return NextResponse.json({ message: 'Unauthorized: Only innovators can update innovations.' }, { status: 403 });
    }

    const { id } = params;
    const { title, description, category } = await request.json();

    const existingInnovation = await prisma.innovation.findUnique({ where: { id } });

    if (!existingInnovation) {
      return NextResponse.json({ message: 'Innovation not found' }, { status: 404 });
    }

    // Authorization: Only the owner can update the innovation
    if (session.user?.id !== existingInnovation.ownerId) {
      return NextResponse.json({ message: 'Forbidden: You do not have permission to update this innovation.' }, { status: 403 });
    }

    const updatedInnovation = await prisma.innovation.update({
      where: { id },
      data: {
        title: title || existingInnovation.title,
        description: description || existingInnovation.description,
        category: category || existingInnovation.category,
      },
    });

    return NextResponse.json(updatedInnovation, { status: 200 });
  } catch (error) {
    console.error('Error updating innovation:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.INNOVATOR) {
      return NextResponse.json({ message: 'Unauthorized: Only innovators can delete innovations.' }, { status: 403 });
    }

    const { id } = params;

    const existingInnovation = await prisma.innovation.findUnique({ where: { id } });

    if (!existingInnovation) {
      return NextResponse.json({ message: 'Innovation not found' }, { status: 404 });
    }

    // Authorization: Only the owner can delete the innovation
    if (session.user?.id !== existingInnovation.ownerId) {
      return NextResponse.json({ message: 'Forbidden: You do not have permission to delete this innovation.' }, { status: 403 });
    }

    await prisma.innovation.delete({ where: { id } });

    return NextResponse.json({ message: 'Innovation deleted successfully' }, { status: 204 });
  } catch (error) {
    console.error('Error deleting innovation:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
