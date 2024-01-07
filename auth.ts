import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

import { getUserByid } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationTokenByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // spread auth config because this file will contain the prsimaAdapter and it doese not support edge

  // NOTE: This event is to prepopulate the verifiedEmail field in db if user loggs in using oAuth.

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    // NOTE: what this does is that if the user is logged in but not verified then it will not allow to login.

    async signIn({ user, account }) {
      // allow oAuth wihtout email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserByid(user.id);

      // don't allow to login if email is not verified
      if (!existingUser?.emailVerified) return false;

      // TODO:Add 2fa check

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation =
          await getTwoFactorConfirmationTokenByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        // TODO: Delete 2FA-confirmation for next sign-in

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },

    async session({ token, session }) {
      console.log({ sessionToken: token });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if (session.user) {
        session.user.name = token.name;

        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },
    async jwt({ token }) {
      // NOTE: if you don't have token . sub then you are logged out. so just return the token here itself
      console.log("I AM BEING CALLED AGAIN");
      if (!token.sub) return token;

      const existingUser = await getUserByid(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOauth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      // assign the role to the token
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
