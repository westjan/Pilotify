import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const pilotProject = await prisma.pilotProject.findUnique({
      where: { id },
      include: {
        corporate: true,
        innovator: true,
      },
    });

    if (!pilotProject) {
      return NextResponse.json({ message: 'Pilot Project not found' }, { status: 404 });
    }

    // Authorization: Only participants can view the project
    if (session.user?.id !== pilotProject.corporateId && session.user?.id !== pilotProject.innovatorId) {
      return NextResponse.json({ message: 'Forbidden: You do not have access to this project.' }, { status: 403 });
    }

    return NextResponse.json(pilotProject, { status: 200 });
  } catch (error) {
    console.error('Error fetching pilot project:', error);
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
    const { title, description, status } = await request.json();

    const existingPilotProject = await prisma.pilotProject.findUnique({ where: { id } });

    if (!existingPilotProject) {
      return NextResponse.json({ message: 'Pilot Project not found' }, { status: 404 });
    }

    // Authorization: Only participants can update the project
    if (session.user?.id !== existingPilotProject.corporateId && session.user?.id !== existingPilotProject.innovatorId) {
      return NextResponse.json({ message: 'Forbidden: You do not have permission to update this project.' }, { status: 403 });
    }

    const updatedPilotProject = await prisma.pilotProject.update({
      where: { id },
      data: {
        title: title || existingPilotProject.title,
        description: description || existingPilotProject.description,
        status: status || existingPilotProject.status,
      },
    });

    return NextResponse.json(updatedPilotProject, { status: 200 });
  } catch (error) {
    console.error('Error updating pilot project:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const existingPilotProject = await prisma.pilotProject.findUnique({ where: { id } });

    if (!existingPilotProject) {
      return NextResponse.json({ message: 'Pilot Project not found' }, { status: 404 });
    }

    // Authorization: Only participants can delete the project
    if (session.user?.id !== existingPilotProject.corporateId && session.user?.id !== existingPilotProject.innovatorId) {
      return NextResponse.json({ message: 'Forbidden: You do not have permission to delete this project.' }, { status: 403 });
    }

    await prisma.pilotProject.delete({ where: { id } });

    return NextResponse.json({ message: 'Pilot Project deleted successfully' }, { status: 204 });
  } catch (error) {
    console.error('Error deleting pilot project:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
