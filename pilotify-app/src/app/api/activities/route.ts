import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    const limit = 5; // Limit to 5 recent activities
    const lastViewedAt = session.user.lastViewedActivitiesAt ? new Date(session.user.lastViewedActivitiesAt) : undefined;

    const commonWhere: any = all ? {} : (lastViewedAt ? { createdAt: { gt: lastViewedAt } } : {});

    // Fetch recent pilot projects
    const recentPilotProjects = await prisma.pilotProject.findMany({
      where: commonWhere,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        createdAt: true,
        corporate: { select: { id: true, name: true } },
        innovator: { select: { id: true, name: true } },
      },
    });

    // Fetch recent offers
    const recentOffers = await prisma.offer.findMany({
      where: commonWhere,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        createdAt: true,
        owner: { select: { id: true, name: true } },
      },
    });

    // Fetch recent reviews
    const recentReviews = await prisma.review.findMany({
      where: commonWhere,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        comment: true,
        createdAt: true,
        reviewer: { select: { id: true, name: true } },
        pilotProject: { select: { id: true, title: true } },
      },
    });

    // Fetch recent reactions on user's comments
    const recentReactions = await prisma.reaction.findMany({
      where: {
        ...commonWhere,
        userId: { not: session.user.id }, // Exclude reactions by self
        comment: {
          userId: session.user.id, // Only reactions on user's comments
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        type: true,
        createdAt: true,
        user: { select: { id: true, name: true } }, // The reactor
        comment: {
          select: {
            id: true,
            text: true,
            pilotProject: { select: { id: true, title: true } },
          },
        },
      },
    });

    // Combine and sort all activities by createdAt
    const allActivities = [
      ...recentPilotProjects.map(p => ({
        type: 'Pilot Project',
        id: p.id,
        title: p.title,
        createdAt: p.createdAt,
        description: `New pilot project '${p.title}' created between ${p.corporate.name} and ${p.innovator.name}.`,
        isMyAction: p.corporate.id === session.user.id || p.innovator.id === session.user.id,
      })),
      ...recentOffers.map(o => ({
        type: 'Offer',
        id: o.id,
        title: o.title,
        createdAt: o.createdAt,
        description: `New marketplace offer '${o.title}' by ${o.owner.name}.`,
        isMyAction: o.owner.id === session.user.id,
      })),
      ...recentReviews.filter(r => r.pilotProject).map(r => ({
        type: 'Review',
        id: r.id,
        title: `Review for ${r.pilotProject?.title || 'Deleted Project'}`,
        createdAt: r.createdAt,
        description: `Review for pilot project '${r.pilotProject?.title || 'Deleted Project'}' by ${r.reviewer.name}: "${r.comment || 'No comment'}".`,
        isMyAction: r.reviewer.id === session.user.id,
        pilotProject: r.pilotProject, // Pass pilotProject for navigation
      })),
      ...recentReactions.filter(r => r.comment?.pilotProject).map(r => ({
        type: 'Reaction',
        id: r.id,
        title: `Reaction on your comment`,
        createdAt: r.createdAt,
        description: `${r.user.name} reacted ${r.type} to your comment "${r.comment.text.substring(0, 20)}...".`,
        isMyAction: false, // This is always false as we filter out self-reactions
        pilotProject: r.comment?.pilotProject, // Pass pilotProject for navigation
      })),
    ].filter(activity => !activity.isMyAction).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(allActivities.slice(0, limit), { status: 200 });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
