import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  // NOTE: generate new token
  const token = uuidv4();
  // NOTE: expire the token in one hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // NOTE: check if an existing token is already sent for this email;

  const exisitngToken = await getVerificationTokenByEmail(email);

  // if there is already a token with that emai  then remove it from the db
  if (exisitngToken) {
    await db.verificationToken.delete({
      where: {
        id: exisitngToken.id,
      },
    });
  }

  // NOTE: genereate new verification token

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return verificationToken;
};
