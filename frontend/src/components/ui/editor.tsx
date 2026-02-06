"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Code, Heading2 } from "lucide-react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Editor({ value, onChange, placeholder }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
        emptyEditorClass: "is-editor-empty before:content-[attr(data-placeholder)] before:text-zinc-400 before:float-left before:pointer-events-none before:h-0",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] px-3 py-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-zinc-300 dark:border-zinc-800 rounded-md overflow-hidden bg-transparent focus-within:ring-2 focus-within:ring-primary/50 transition-all flex flex-col w-full h-full">
      <div className="flex items-center gap-1 p-1 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={<Bold size={14} />}
          title="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={<Italic size={14} />}
          title="Italic"
        />
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          icon={<Heading2 size={14} />}
          title="Heading"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={<List size={14} />}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={<ListOrdered size={14} />}
          title="Ordered List"
        />
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          icon={<Code size={14} />}
          title="Code Block"
        />
      </div>
      <div className="flex-1 overflow-y-auto cursor-text bg-transparent" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, isActive, icon, title }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${
        isActive
          ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
          : "text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
      }`}
    >
      {icon}
    </button>
  );
}