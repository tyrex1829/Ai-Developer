import React from "react";
import { Code2, Eye } from "lucide-react";

interface TabViewProps {
  activeTab: "code" | "preview";
  onTabChange: (tab: "code" | "preview") => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <div className="flex space-x-3 mb-4">
      <button
        onClick={() => onTabChange("code")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all relative group ${
          activeTab === "code"
            ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white"
            : "bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
        }`}
      >
        {activeTab === "code" && (
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
        )}
        <Code2
          className={`w-4 h-4 ${
            activeTab === "code" ? "text-white" : "text-zinc-400"
          }`}
        />
        <span className="relative z-10">Code</span>
      </button>

      <button
        onClick={() => onTabChange("preview")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all relative group ${
          activeTab === "preview"
            ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white"
            : "bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
        }`}
      >
        {activeTab === "preview" && (
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
        )}
        <Eye
          className={`w-4 h-4 ${
            activeTab === "preview" ? "text-white" : "text-zinc-400"
          }`}
        />
        <span className="relative z-10">Preview</span>
      </button>
    </div>
  );
}
