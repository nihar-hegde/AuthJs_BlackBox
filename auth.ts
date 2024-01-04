import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  // spread auth config because this file will contain the prsimaAdapter and it doese not support edge
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
