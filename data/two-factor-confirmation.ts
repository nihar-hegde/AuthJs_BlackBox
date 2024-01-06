import { db } from "@/lib/db";
// NOTE: we can use the userId because in the schema we have direct relation to userID and token

export const getTwoFactorConfirmationTokenByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmationToken =
      await db.twoFactorConfirmation.findUnique({
        where: { userId },
      });
    return twoFactorConfirmationToken;
  } catch {
    return null;
  }
};
