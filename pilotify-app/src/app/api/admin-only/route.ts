import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@/generated/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ message: 'Access Denied: Admin role required.' }, { status: 403 });
  }

  return NextResponse.json({ message: 'Welcome, Admin!', user: session.user }, { status: 200 });
}
