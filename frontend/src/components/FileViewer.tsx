import React from "react";
import { X } from "lucide-react";
import { FileViewerProps } from "../types";

export function FileViewer({ file, onClose }: FileViewerProps) {
  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="p-0.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 relative group w-full max-w-3xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />

        <div className="relative bg-zinc-900/90 rounded-xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800/80">
            <h3 className="text-lg font-bold text-white tracking-tight [text-shadow:0_0_20px_#3B82F640]">
              {file.path}
            </h3>
            <button
              onClick={onClose}
              className="p-2 bg-zinc-900/80 border border-zinc-800/80 rounded-lg relative group hover:opacity-80 transition-opacity"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <div className="p-4 overflow-auto max-h-[calc(80vh-4rem)]">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap">
              {file.content || "No content available"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
