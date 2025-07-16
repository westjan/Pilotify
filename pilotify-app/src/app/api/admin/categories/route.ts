import { NextResponse } from 'next/server';
import { PrismaClient, Role } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/admin/categories - Get all categories (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/categories - Create a new category (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/categories/[id] - Update a category (Admin only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
      },
    });
    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id] - Delete a category (Admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
