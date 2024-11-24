import { createContext } from "react";

export type TabType = {
  id: number;
  label: string;
  content: React.ReactNode;
}

export type TabsContextType = {
  tabs: TabType[] | null;
  setCurrentTabById: (tabId: number) => void;
};

export const TabsContext = createContext<TabsContextType | undefined>(undefined);