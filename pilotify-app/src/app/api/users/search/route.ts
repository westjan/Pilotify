import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Role } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  console.log('API: /api/users/search hit');
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const role = searchParams.get('role') as Role | null;
    console.log('API: Search query:', query, 'Role:', role);

    if (!query && !role) {
      return NextResponse.json({ message: 'Please provide a search query or a role.' }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          role ? { role } : {},
          {
            OR: [
              { name: { contains: query } },
              { email: { contains: query } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        profilePictureUrl: true,
        companyLogoUrl: true,
      },
      take: 10, // Limit results for performance
    });
    console.log('API: Found users:', users.length);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
