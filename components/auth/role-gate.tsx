"use client";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import React from "react";
import { FormError } from "../form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole;
}
export const RoleGate = ({ children, allowedRoles }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRoles) {
    return (
      <FormError message="You do not have permission to View this Content." />
    );
  }
  return <>{children}</>;
};
// NOTE: a reusable component that hides some content from some user based on role
