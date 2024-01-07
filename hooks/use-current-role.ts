// NOTE: if the role is required in a client component then use this
import { useSession } from "next-auth/react";

export const useCurrentRole = () => {
  const session = useSession();

  return session.data?.user.role;
};
