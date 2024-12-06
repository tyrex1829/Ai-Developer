import React, { useState } from "react";
import { FolderTree, File, ChevronRight, ChevronDown } from "lucide-react";
import { FileItem } from "../types";

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}

function FileNode({ item, depth, onFileClick }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 p-2 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors group"
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={handleClick}
      >
        {item.type === "folder" && (
          <span className="text-zinc-400">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        {item.type === "folder" ? (
          <FolderTree className="w-4 h-4 text-cyan-500" />
        ) : (
          <File className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300" />
        )}
        <span className="text-zinc-300 group-hover:text-white transition-colors">
          {item.name}
        </span>
      </div>
      {item.type === "folder" && isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-bold text-white tracking-tight [text-shadow:0_0_20px_#3B82F640] mb-4 flex items-center gap-2 flex-shrink-0">
        <FolderTree className="w-5 h-5 text-cyan-500" />
        File Explorer
      </h2>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 min-h-0">
        <div className="space-y-1">
          {files.map((file, index) => (
            <FileNode
              key={`${file.path}-${index}`}
              item={file}
              depth={0}
              onFileClick={onFileSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
