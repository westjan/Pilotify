import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const pilotProjects = await prisma.pilotProject.findMany({
      include: {
        corporate: true,
        innovator: true,
      },
    });

    return NextResponse.json(pilotProjects, { status: 200 });
  } catch (error) {
    console.error('Error fetching pilot projects:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, corporateId, innovatorId } = await request.json();

    if (!title || !corporateId || !innovatorId) {
      return NextResponse.json({ message: 'Missing required fields: title, corporateId, innovatorId' }, { status: 400 });
    }

    // Basic authorization: Only allow users to create projects where they are either the corporate or innovator
    if (session.user?.id !== corporateId && session.user?.id !== innovatorId) {
      return NextResponse.json({ message: 'Forbidden: You can only create projects where you are a participant.' }, { status: 403 });
    }

    const newPilotProject = await prisma.pilotProject.create({
      data: {
        title,
        description,
        corporate: { connect: { id: corporateId } },
        innovator: { connect: { id: innovatorId } },
      },
    });

    return NextResponse.json(newPilotProject, { status: 201 });
  } catch (error) {
    console.error('Error creating pilot project:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
