import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { ConversationsContainer } from "~/components/ConversationsContainer";
import { ConversationsList } from "~/components/ConversationsList";
import { MainContainer } from "~/components/MainContainer";
import { Messages } from "~/components/Messages";
import { MessageBox } from "~/components/MessageBox";
import { MessageBoxContainer } from "~/components/MessageBoxContainer";
import { MessagesContainer } from "~/components/MessagesContainer";
import { AuthProvider } from "~/providers/AuthProvider";
import { ConversationsProvider } from "~/providers/ConversationsProvider";
import { TabsProvider } from "~/providers/TabsProvider";
import { Tab } from "~/components/Tab";
import { Contacts } from "~/components/Contacts";
import { useRef } from "react";
import { MessagesProvider } from "~/providers/MessagesProvider";
import { prisma } from "~/databases/prisma";
import { redirect, useLoaderData } from "@remix-run/react";
import { generateContacts } from "./.server/generate-contacts";
import { getSession } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "Demo chat app" },
    { name: "description", content: "A React chat app" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const authId = session.get("authId");

  if (!authId) {
    return redirect("/login");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: authId,
    },
    include: {
      conversations: {
        include: {
          messages: {
            include: {
              author: true,
              recipients: true,
            }
          },
          participants: true,
        }
      }
    },
  });
  if (user) {
    const newUser: { id: number; username: string; contactIds: number[]; contacts: { id: number; username: string; }[] } = {
      ...user,
      contacts: await generateContacts(user.contactIds),
    };
    return newUser;
  }
  return null;
}

export default function Index() {
  const user = useLoaderData<typeof loader>();
  const messageBoxRef = useRef<HTMLTextAreaElement>(null);

  if (user) return (
    <MainContainer>
      <AuthProvider {...user}>
        <ConversationsProvider initConversations={user.conversations}>
          <MessagesProvider messageBoxRef={messageBoxRef}>
            <ConversationsContainer>
              <TabsProvider>
                <Tab id={1} label="Conversations" content={<ConversationsList />} />
                <Tab id={2} label="Contacts" content={<Contacts />} />
                <ConversationsList />
              </TabsProvider>
            </ConversationsContainer>
            <MessagesContainer>
              <Messages />
              <MessageBoxContainer>
                <MessageBox messageBoxRef={messageBoxRef} />
              </MessageBoxContainer>
            </MessagesContainer>
          </MessagesProvider>
        </ConversationsProvider>
      </AuthProvider>
    </MainContainer>
  );
}