"use server";

import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
// NOTE: bcryptjs and bcrypt both work

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // validating schema
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  // exptreact the validated fields
  const { email, password, name } = validatedFields.data;
  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // make sure that email is not taken
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already in use!" };
  }
  // create the user
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // TODO: send verification token email

  return { success: "User Created!" };
};
