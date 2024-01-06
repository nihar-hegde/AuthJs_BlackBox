import { useSession } from "next-auth/react";

// NOTE: custome hook to send the user because the useSession to get the user we need
// to do session.data?.user every thime we need the user so insted we create a custome hook that sends just the user

export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user;
};
