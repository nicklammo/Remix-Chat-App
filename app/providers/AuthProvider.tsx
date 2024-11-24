import { Conversation } from "@prisma/client";
import { useCallback, useState } from "react";
import { AuthContext } from "~/contexts/AuthContext";
export const AuthProvider = ({
  id,
  username,
  contacts,
  conversations,
  children,
}: {
  id: number;
  username: string;
  contacts: { id: number; username: string }[];
  conversations: Conversation[];
  children: React.ReactNode;
}) => {
  const [user,] = useState<{
    id: number;
    username: string;
    contacts: { id: number; username: string; }[];
    conversations: Conversation[];
  }>({
    id,
    username,
    contacts,
    conversations,
  });

  const setUserById = useCallback(async (userId: number) => {
    const res = await fetch(`http://localhost:5173/api/switch-user?userId=${userId}`);
    if (res.ok) {
      window.location.reload();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...user, setUserById }}>
      {children}
    </AuthContext.Provider>
  )
}