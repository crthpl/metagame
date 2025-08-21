"use client";
import { useState, useEffect } from "react";
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
} from "kbar";
import { staticActions } from "@/config/kbarActions";

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        // Handle section items
        if (typeof item === "string") {
          return (
            <div className="text-primary-400 bg-dark-600 px-4 py-2 text-sm font-bold">
              {item}
            </div>
          );
        }

        // Render action items
        return (
          <div
            className={`flex cursor-pointer items-center justify-between px-4 py-2 ${
              active ? "bg-primary-600 text-white" : "text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {item.icon && (
                <span className="w-8 text-center text-lg">{item.icon}</span>
              )}
              <div>
                <div className="font-medium">{item.name}</div>
                {item.subtitle && (
                  <span
                    className={`text-sm ${active ? "text-gray-200" : "text-gray-400"}`}
                  >
                    {item.subtitle}
                  </span>
                )}
              </div>
            </div>
            {item.shortcut?.length ? (
              <div className="flex items-center gap-1">
                {item.shortcut.map((sc: string) => (
                  <kbd
                    key={sc}
                    className={`rounded px-2 py-1 text-xs ${
                      active ? "bg-primary-700" : "bg-gray-700"
                    }`}
                  >
                    {sc}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        );
      }}
    />
  );
}

export function KbarApp({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = useState(staticActions);

  useEffect(() => {
    // Add dynamic actions based on current route
    const path = window.location.pathname;
    const dynamicActions = [];

    // Game-specific actions
    if (path.startsWith("/games/")) {
      dynamicActions.push({
        id: "restart-game",
        name: "Restart Game",
        icon: "🔄",
        section: "Game Controls",
        shortcut: ["r"],
        perform: () => window.location.reload(),
      });
    }

    // Session-specific actions
    if (path.startsWith("/sessions/")) {
      dynamicActions.push({
        id: "add-to-calendar",
        name: "Add to Calendar",
        icon: "📅",
        section: "Session Actions",
        shortcut: ["c"],
        perform: () => console.log("Add to calendar"),
      });
    }

    // Update actions with dynamic ones
    setActions([...staticActions, ...dynamicActions]);
  }, []);

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="fixed inset-0 z-50 bg-black/60">
          <KBarAnimator className="bg-bg-secondary w-full max-w-xl overflow-hidden rounded-lg shadow-lg">
            <KBarSearch
              className="w-full border-b border-gray-700 bg-transparent px-4 py-3 text-lg text-white placeholder-gray-400 focus:outline-none"
              placeholder="Type a command or search..."
            />
            <div className="max-h-[500px] overflow-y-auto">
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}
