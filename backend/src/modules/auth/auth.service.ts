import { prisma } from "../../lib/db.js";

export const checkEmailAvailability = async (
  email: string
): Promise<{ available: boolean }> => {
  const existingUser = await getUserByEmail(email);
  return { available: existingUser === null };
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });
  return user;
};
