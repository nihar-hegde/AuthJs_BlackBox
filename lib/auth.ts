// NOTE: reusable lib to get a session user directly insted of writing session.user everythime

import { auth } from "@/auth";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

// NOTE: use in server component
export const currentRole = async () => {
  const session = await auth();
  return session?.user?.role;
};
