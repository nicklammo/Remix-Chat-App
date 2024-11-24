import { LoaderFunction, redirect } from "@remix-run/node"
import { prisma } from "~/databases/prisma";
import { getSession } from "~/sessions"

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const authId = session.get("authId");

  if (!authId) {
    return redirect("/login");
  }

  const url = new URL(request.url);
  const recipientId = url.searchParams.get("recipientId");

  if (!recipientId) {
    return Response.json({ error: "Recipient ID is required" });
  }

  const recipient = await prisma.user.findUnique({
    where: { id: parseInt(recipientId) },
  });

  if (!recipient) {
    return Response.json({ error: "Recipient not found" });
  }

  const conversationExists = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { id: authId } } },
        { participants: { some: { id: parseInt(recipientId) } } },
      ]
    }
  });

  if (conversationExists) {
    return Response.json({ conversation: conversationExists });
  }

  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        connect: [{ id: authId }, { id: parseInt(recipientId) }],
      }
    }
  });

  return Response.json({ conversation: conversation });
}

export const APICreateConversation = () => {
  return null;
}