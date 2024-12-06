import React from "react";
import Editor from "@monaco-editor/react";
import { FileItem } from "../types";
import { File } from "lucide-react";

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-lg relative group inline-block">
            <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl group-hover:bg-blue-500/30 transition-all duration-300" />
            <File className="w-6 h-6 text-cyan-500 relative z-10" />
          </div>
          <p className="text-zinc-400">Select a file to view its contents</p>
        </div>
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="typescript"
      theme="vs-dark"
      value={file.content || ""}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
      }}
    />
  );
}
