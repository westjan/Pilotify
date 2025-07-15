import { getServerSession } from "next-auth/next";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { Role } from "@/generated/prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function currentUserHasRole(role: Role) {
  const user = await getCurrentUser();
  return user?.role === role;
}

export async function currentUserIsAdmin() {
  const user = await getCurrentUser();
  return user?.role === Role.ADMIN;
}
