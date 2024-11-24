import { LoaderFunction, redirect } from "@remix-run/node";
import { prisma } from "~/databases/prisma";
import { getSession } from "~/sessions"

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const authId = session.get("authId");

  if (!authId) {
    return redirect("/login");
  }

  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId");

  if (!conversationId) {
    return Response.json({ error: "Conversation ID is required" });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: parseInt(conversationId) },
    include: {
      participants: true,
      messages: true,
    }
  });


  if (!conversation) {
    return Response.json({ error: "Conversation not found" });
  }

  const isAuthUserParticipant = conversation.participants.some((user) => user.id === authId);

  if (!isAuthUserParticipant) {
    return Response.json({ error: "User is not a part of this conversation" });
  }

  const updatedMessages = await Promise.all(
    conversation.messages.map(async (message) => {
      if (message.authorId !== authId && !message.isRead) {
        return prisma.message.update({
          where: { id: message.id },
          data: { isRead: true },
        })
      }
      return message;
    })
  );

  return Response.json({ messages: updatedMessages });
}