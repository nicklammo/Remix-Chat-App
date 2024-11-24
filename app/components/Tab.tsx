import { TabType } from "~/contexts/TabsContext";
import { useTabs } from "~/hooks/useTabs";

export const Tab = ({ id, label, content }: TabType) => {
  const { setCurrentTabById } = useTabs();
  return (
    <button
      onClick={() => setCurrentTabById(id)}
      className="w-full px-4 py-2 hover:bg-gray-800 rounded"
    >
      {label}
    </button>
  );
}