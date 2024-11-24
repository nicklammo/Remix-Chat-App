import { Message, User } from "@prisma/client";

export type DatabaseConversation = {
  id: number;
  messages: DatabaseMessage[];
  participants: User[];
}

export type DatabaseMessage = Message & {
  author: User;
  recipients: User[];
}