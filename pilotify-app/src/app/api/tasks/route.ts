import { NextResponse } from 'next/server';
import { PrismaClient, TaskStatus, TaskPriority, Role } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/tasks?pilotProjectId=... - Get tasks for a specific pilot project
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pilotProjectId = searchParams.get('pilotProjectId');

    if (!pilotProjectId) {
      return NextResponse.json({ message: 'pilotProjectId is required' }, { status: 400 });
    }

    // Check if user is a participant of the project
    const pilotProject = await prisma.pilotProject.findUnique({
      where: { id: pilotProjectId },
      select: { corporateId: true, innovatorId: true },
    });

    if (!pilotProject) {
      return NextResponse.json({ message: 'Pilot project not found' }, { status: 404 });
    }

    if (session.user?.id !== pilotProject.corporateId && session.user?.id !== pilotProject.innovatorId) {
      return NextResponse.json({ message: 'Forbidden: You can only view tasks for projects you participated in' }, { status: 403 });
    }

    const tasks = await prisma.task.findMany({
      where: { pilotProjectId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePictureUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { pilotProjectId, title, description, status, priority, dueDate, assignedToId } = await request.json();

    if (!pilotProjectId || !title) {
      return NextResponse.json({ message: 'pilotProjectId and title are required' }, { status: 400 });
    }

    // Check if user is a participant of the project
    const pilotProject = await prisma.pilotProject.findUnique({
      where: { id: pilotProjectId },
      select: { corporateId: true, innovatorId: true },
    });

    if (!pilotProject) {
      return NextResponse.json({ message: 'Pilot project not found' }, { status: 404 });
    }

    if (session.user?.id !== pilotProject.corporateId && session.user?.id !== pilotProject.innovatorId) {
      return NextResponse.json({ message: 'Forbidden: You can only create tasks for projects you participated in' }, { status: 403 });
    }

    const newTask = await prisma.task.create({
      data: {
        pilotProjectId,
        title,
        description,
        status: status || TaskStatus.OPEN,
        priority: priority || TaskPriority.MEDIUM,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignedToId,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
