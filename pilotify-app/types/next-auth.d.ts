import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      role?: Role;
      id?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: Role;
    id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    id?: string;
  }
}
