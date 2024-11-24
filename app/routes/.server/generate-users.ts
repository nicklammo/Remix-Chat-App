import { prisma } from "~/databases/prisma";

export const generateUsers = async () => {
  await prisma.user.createMany({
    data: [
      { id: 1, username: "Nick", contactIds: [2, 3, 4, 5] },
      { id: 2, username: "Alex", contactIds: [1, 3, 4, 5] },
      { id: 3, username: "Bob", contactIds: [1, 2, 4, 5] },
      { id: 4, username: "Dave", contactIds: [1, 2, 3, 5] },
      { id: 5, username: "Kal", contactIds: [1, 2, 3, 4] },
    ],
    skipDuplicates: true,
  })
}