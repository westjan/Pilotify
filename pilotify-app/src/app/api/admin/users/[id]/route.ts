import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Role } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET /api/admin/users/[id] - Get a single user by ID (Admin only)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        contactInfo: true,
        profilePictureUrl: true,
        companyLogoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/users/[id] - Update a user by ID (Admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { email, name, role, companyName, contactInfo, profilePictureUrl, companyLogoUrl } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        name,
        role,
        companyName,
        contactInfo,
        profilePictureUrl,
        companyLogoUrl,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        contactInfo: true,
        profilePictureUrl: true,
        companyLogoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Delete a user by ID (Admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
