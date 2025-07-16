import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Role } from "@/generated/prisma";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// GET /api/admin/users - Get all users (Admin only)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
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

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/users - Create a new user (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { email, password, name, role, companyName, contactInfo, profilePictureUrl, companyLogoUrl } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
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

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/users/[id] - Update a user (Admin only)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id, email, name, role, companyName, contactInfo, profilePictureUrl, companyLogoUrl } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
    }

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

// DELETE /api/admin/users/[id] - Delete a user (Admin only)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
