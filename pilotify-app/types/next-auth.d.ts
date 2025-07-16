import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      role?: Role;
      id?: string;
      profilePictureUrl?: string | null;
      companyName?: string | null;
      contactInfo?: string | null;
      companyLogoUrl?: string | null;
      lastViewedActivitiesAt?: Date | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: Role;
    id?: string;
    profilePictureUrl?: string | null;
    companyName?: string | null;
    contactInfo?: string | null;
    companyLogoUrl?: string | null;
    lastViewedActivitiesAt?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    id?: string;
    profilePictureUrl?: string | null;
    companyName?: string | null;
    contactInfo?: string | null;
    companyLogoUrl?: string | null;
    lastViewedActivitiesAt?: Date | null;
  }
}