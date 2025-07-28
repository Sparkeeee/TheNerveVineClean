"use client";
import { useEffect, useState, useRef } from "react";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

export default function TiptapEditor({ value, onChange }: { value: string, onChange: (val: string) => void }): JSX.Element | null {
  const [hasMounted, setHasMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setHasMounted(true); }, []);
  const editor = useEditor({
    extensions: [StarterKit, Underline, Link],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
     
  }, [value, editor]);
  if (!hasMounted) return null;

  const setFileContent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    editor?.commands.setContent(text);
    e.target.value = ""; // reset file input
  };

  const ToolbarButton = ({ onClick, active, label }: { onClick: () => void, active?: boolean, label: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 rounded mx-1 ${active ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"}`}
      tabIndex={-1}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center mb-2">
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive('bold')}
          label="Bold"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive('italic')}
          label="Italic"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          active={editor?.isActive('underline')}
          label="Underline"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor?.isActive('heading', { level: 1 })}
          label="H1"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor?.isActive('heading', { level: 2 })}
          label="H2"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor?.isActive('heading', { level: 3 })}
          label="H3"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive('bulletList')}
          label="• List"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive('orderedList')}
          label="1. List"
        />
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Enter URL');
            if (url) editor?.chain().focus().setLink({ href: url }).run();
          }}
          active={editor?.isActive('link')}
          label="Link"
        />
        <button
          type="button"
                        className="ml-4 px-3 py-1 rounded bg-lime-600 text-white hover:bg-lime-700"
          onClick={() => fileInputRef.current?.click()}
        >
          Import from File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.html,.md"
          className="hidden"
          onChange={setFileContent}
        />
      </div>
      <div className="border border-gray-600 rounded bg-gray-700 text-gray-100 p-2 min-h-[120px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
} 