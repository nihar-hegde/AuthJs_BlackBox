"use client";
// NOTE: use the useCurrent use hook to get the user data from the session because it works on client components
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage = () => {
  const user = useCurrentUser();
  return <UserInfo label="👤Client Component" user={user} />;
};

export default ClientPage;
