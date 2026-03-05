"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from "lucide-react";
import type { TreeNode } from "@/lib/types";

interface DocumentTreeProps {
  onLoadDocument: (path: string) => void;
  activeDocPath: string | null;
}

function TreeNodeItem({
  node,
  depth,
  onLoad,
  activePath,
}: {
  node: TreeNode;
  depth: number;
  onLoad: (path: string) => void;
  activePath: string | null;
}) {
  const [expanded, setExpanded] = useState(depth < 2);

  if (node.type === "folder") {
    const hasChildren = node.children && node.children.length > 0;
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 w-full text-left py-1 hover:bg-muted/50 rounded-sm transition-colors"
          style={{ paddingLeft: `${4 + depth * 14}px`, paddingRight: "4px" }}
        >
          {hasChildren ? (
            expanded ? <ChevronDown size={12} className="text-muted-foreground flex-shrink-0" /> : <ChevronRight size={12} className="text-muted-foreground flex-shrink-0" />
          ) : (
            <span className="w-3 flex-shrink-0" />
          )}
          {expanded ? (
            <FolderOpen size={14} className="text-muted-foreground flex-shrink-0" />
          ) : (
            <Folder size={14} className="text-muted-foreground flex-shrink-0" />
          )}
          <span className="text-xs font-medium truncate">{node.name}</span>
        </button>
        {expanded && node.children?.map((child, i) => (
          <TreeNodeItem key={i} node={child} depth={depth + 1} onLoad={onLoad} activePath={activePath} />
        ))}
      </div>
    );
  }

  const isActive = node.path === activePath;
  return (
    <button
      onClick={() => node.path && onLoad(node.path)}
      className={`flex items-center gap-1.5 w-full text-left py-1 rounded-sm transition-colors ${
        isActive ? "bg-muted font-semibold" : "hover:bg-muted/50"
      }`}
      style={{ paddingLeft: `${4 + depth * 14}px`, paddingRight: "4px" }}
    >
      <span className="w-3 flex-shrink-0" />
      <FileText size={14} className={`flex-shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
      <span className="text-xs truncate">{node.name}</span>
      {node.pageCount && node.pageCount > 1 && (
        <span className="ml-auto text-[10px] text-muted-foreground flex-shrink-0 tabular-nums">
          {node.pageCount}p
        </span>
      )}
    </button>
  );
}

export function DocumentTree({ onLoadDocument, activeDocPath }: DocumentTreeProps) {
  const [tree, setTree] = useState<TreeNode[]>([]);

  const fetchTree = useCallback(async () => {
    try {
      const res = await fetch("/api/documents/tree");
      if (res.ok) {
        const data = await res.json();
        setTree(data.root || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchTree();
    const interval = setInterval(fetchTree, 30000);
    return () => clearInterval(interval);
  }, [fetchTree]);

  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Documents
      </h3>
      {tree.length === 0 ? (
        <p className="text-xs text-muted-foreground">No documents yet.</p>
      ) : (
        <div className="space-y-0.5">
          {tree.map((node, i) => (
            <TreeNodeItem key={i} node={node} depth={0} onLoad={onLoadDocument} activePath={activeDocPath} />
          ))}
        </div>
      )}
    </div>
  );
}
