import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: session.user.id as string },
      data: {
        lastViewedActivitiesAt: new Date(),
      },
    });
    console.log('Updated lastViewedActivitiesAt for user:', session.user.id, 'to', new Date());

    return NextResponse.json({ message: 'Last viewed activities timestamp updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating last viewed activities timestamp:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
