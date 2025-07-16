import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { // Select specific fields to avoid exposing password
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

    // Only allow users to view their own profile or if they are an admin
    if (session.user?.id !== user.id && session.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden: You can only view your own profile.' }, { status: 403 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { name, companyName, contactInfo, profilePictureUrl, companyLogoUrl } = await request.json();

    // Only allow users to update their own profile or if they are an admin
    if (session.user?.id !== id && session.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden: You can only update your own profile.' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        companyName,
        contactInfo,
        profilePictureUrl,
        companyLogoUrl,
      },
      select: { // Select specific fields to avoid exposing password
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
    console.error('Error updating user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
