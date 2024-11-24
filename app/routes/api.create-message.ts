import { LoaderFunction, redirect } from "@remix-run/node";
import { prisma } from "~/databases/prisma";
import { getSession } from "~/sessions"
import { DatabaseMessage } from "~/types";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const authId = session.get("authId");

  if (!authId) {
    return redirect("/login");
  }

  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId");
  const messageContent = url.searchParams.get("messageContent")?.trim();

  if (!conversationId) {
    return Response.json({ error: "Conversation ID is required" });
  }

  if (!messageContent) {
    return Response.json({ error: "Message Content is required" });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: parseInt(conversationId) },
    include: {
      participants: true,
    }
  });


  if (!conversation) {
    return Response.json({ error: "Conversation not found" });
  }

  const isAuthUserParticipant = conversation.participants.some((user) => user.id === authId);

  if (!isAuthUserParticipant) {
    return Response.json({ error: "User is not a part of this conversation" });
  }

  const newMessage = await prisma.message.create({
    data: {
      authorId: authId,
      conversationId: parseInt(conversationId),
      recipients: {
        create: conversation.participants
          .filter(({ id }) => id !== authId)
          .map(({ id }) => ({ userId: id })),
      },
      content: messageContent,
      isRead: false,
    }
  }) as DatabaseMessage;

  return Response.json({ message: newMessage });
}