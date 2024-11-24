import React, { Children, isValidElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tab } from "~/components/Tab";
import { TabsContext, TabType } from "~/contexts/TabsContext";

export const TabsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentTab, setCurrentTab] = useState<TabType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs = useMemo(() => {
    return Children.map(children, (child) => {
      if (isValidElement(child) && child.type === Tab) {
        const { id, label, content } = child.props;
        return {
          id,
          label,
          content,
        } as TabType;
      }
      return null;
    }) || [];
  }, [children]);

  const initCurrentTab = useCallback(() => {
    if (tabs && tabs.length > 0) {
      const lowestId = Math.min(...tabs.map(tab => tab.id));
      setCurrentTab(tabs.find(({ id }) => id === lowestId) || null);
    }
  }, [tabs]);

  const setCurrentTabById = useCallback((tabId: number) => {
    if (tabs) {
      setCurrentTab(tabs.find(({ id }) => tabId === id) || null);
    }
  }, [tabs]);

  useEffect(() => {
    initCurrentTab();
  }, [initCurrentTab]);


  return (
    <TabsContext.Provider value={{ tabs, setCurrentTabById }}>
      <div ref={containerRef} className={`grid grid-cols-2 mb-2`}>
        {Children.map(children, (child) => (
          isValidElement(child) && child.type === Tab && child
        ))}
      </div>
      {currentTab?.content || null}
    </TabsContext.Provider>
  );
};