import { ReactNode, useState } from "react";

interface Tab {
  id: string;
  title: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  className?: string;
}

export const Tabs = ({ tabs, defaultTabId, className = "" }: TabsProps) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-end px-7">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              style={{ border: "none" }}
              className={`
                relative px-8 py-3 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-card-bg text-text-main rounded-t-[12px] opacity-100 z-10"
                    : "text-text-muted bg-main-bg hover:text-text-main opacity-60 hover:opacity-100"
                }
              `}
            >
              {isActive && (
                <div className="absolute bottom-0 -left-[20px] w-[20px] h-[20px] bg-card-bg [mask-image:radial-gradient(circle_at_0_0,transparent_20px,black_21px)]" />
              )}

              <span className="relative z-10">{tab.title}</span>

              {isActive && (
                <div className="absolute bottom-0 -right-[20px] w-[20px] h-[20px] bg-card-bg [mask-image:radial-gradient(circle_at_100%_0,transparent_20px,black_21px)]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-card-bg rounded-xl p-6 min-h-[300px]">
        <div className="transition-opacity duration-300">
          {tabs.find((t) => t.id === activeTabId)?.content}
        </div>
      </div>
    </div>
  );
};
