import { prisma } from "~/databases/prisma";

export const generateContacts = async (contactIds: number[]) => {
  const newContacts = await Promise.all(
    contactIds.map(async (contactId) => {
      const contact = await prisma.user.findUnique({
        where: { id: contactId },
        select: { id: true, username: true }
      });
      return contact;
    })
  );
  return newContacts.filter((contact) => contact !== null) || [];
}