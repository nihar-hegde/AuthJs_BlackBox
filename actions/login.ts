// NOTE: IMP: validate the values in server side because it is very easy to bypass the client side validation.
"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // validating schema
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  return { success: "Email Sent!" };
};
