import { NextResponse } from 'next/server';
import { PrismaClient, TaskStatus, TaskPriority, Role } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/tasks/[id] - Get a single task by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        pilotProject: {
          select: {
            id: true,
            title: true,
            corporateId: true,
            innovatorId: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePictureUrl: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    // Authorization: Only participants of the project or assigned user can view
    if (session.user?.id !== task.pilotProject.corporateId && 
        session.user?.id !== task.pilotProject.innovatorId &&
        session.user?.id !== task.assignedToId) {
      return NextResponse.json({ message: 'Forbidden: You do not have access to this task.' }, { status: 403 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/tasks/[id] - Update a task by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { title, description, status, priority, dueDate, assignedToId } = await request.json();

    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        pilotProject: {
          select: {
            corporateId: true,
            innovatorId: true,
          },
        },
      },
    });

    if (!existingTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    // Authorization: Only participants of the project, assigned user, or Admin can update
    if (session.user?.role !== Role.ADMIN &&
        session.user?.id !== existingTask.pilotProject.corporateId && 
        session.user?.id !== existingTask.pilotProject.innovatorId &&
        session.user?.id !== existingTask.assignedToId) {
      return NextResponse.json({ message: 'Forbidden: You do not have permission to update this task.' }, { status: 403 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignedToId,
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Delete a task by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        pilotProject: {
          select: {
            corporateId: true,
            innovatorId: true,
          },
        },
      },
    });

    if (!existingTask) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    // Authorization: Only participants of the project, assigned user, or Admin can delete
    if (session.user?.role !== Role.ADMIN &&
        session.user?.id !== existingTask.pilotProject.corporateId && 
        session.user?.id !== existingTask.pilotProject.innovatorId &&
        session.user?.id !== existingTask.assignedToId) {
      return NextResponse.json({ message: 'Forbidden: You do not have permission to delete this task.' }, { status: 403 });
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
