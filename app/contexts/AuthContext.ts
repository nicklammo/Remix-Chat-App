import { createContext } from "react";
import { Conversation } from "@prisma/client";

export type UserType = {
  id: number;
  username: string;
  contactIds: number[];
}

export type AuthContextType = {
  id: number;
  username: string;
  contacts: { id: number; username: string; }[];
  conversations: Conversation[];
  setUserById: (userId: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);