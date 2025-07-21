"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useEffect, useState, useRef } from "react";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
export default function TiptapEditor({ value, onChange }) {
    const [hasMounted, setHasMounted] = useState(false);
    const fileInputRef = useRef(null);
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
    }, [value]);
    if (!hasMounted)
        return null;
    const setFileContent = (e) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        const text = yield file.text();
        editor === null || editor === void 0 ? void 0 : editor.commands.setContent(text);
        e.target.value = ""; // reset file input
    });
    const ToolbarButton = ({ onClick, active, label }) => (<button type="button" onClick={onClick} className={`px-2 py-1 rounded mx-1 ${active ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"}`} tabIndex={-1}>
      {label}
    </button>);
    return (<div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center mb-2">
        <ToolbarButton onClick={() => editor === null || editor === void 0 ? void 0 : editor.chain().focus().toggleBold().run()} active={editor === null || editor === void 0 ? void 0 : editor.isActive('bold')} label="Bold"/>
        <ToolbarButton onClick={() => editor === null || editor === void 0 ? void 0 : editor.chain().focus().toggleItalic().run()} active={editor === null || editor === void 0 ? void 0 : editor.isActive('italic')} label="Italic"/>
        <ToolbarButton onClick={() => editor === null || editor === void 0 ? void 0 : editor.chain().focus().toggleUnderline().run()} active={editor === null || editor === void 0 ? void 0 : editor.isActive('underline')} label="Underline"/>
        <ToolbarButton onClick={() => editor === null || editor === void 0 ? void 0 : editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor === null || editor === void 0 ? void 0 : editor.isActive('heading', { level: 1 })} label="H1"/>
        <ToolbarButton onClick={() => editor === null || editor === void 0 ? void 0 : editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor === null || editor === void 0 ? void 0 : editor.isActive('heading', { level: 2 })} label="H2"/>
        <ToolbarButton onClick={() => editor === null || editor === void 0 ? void 0 : editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor === null || editor === void 0 ? void 0 : editor.isActive('heading', { level: 3 })} label="H3"/>
        <ToolbarButton onClick={() => editor === null || editor === void 0 ? void 0 : editor.chain().focus().toggleBulletList().run()} active={editor === null || editor === void 0 ? void 0 : editor.isActive('bulletList')} label="• List"/>
        <ToolbarButton onClick={() => editor === null || editor === void 0 ? void 0 : editor.chain().focus().toggleOrderedList().run()} active={editor === null || editor === void 0 ? void 0 : editor.isActive('orderedList')} label="1. List"/>
        <ToolbarButton onClick={() => {
            const url = window.prompt('Enter URL');
            if (url)
                editor === null || editor === void 0 ? void 0 : editor.chain().focus().setLink({ href: url }).run();
        }} active={editor === null || editor === void 0 ? void 0 : editor.isActive('link')} label="Link"/>
        <button type="button" className="ml-4 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700" onClick={() => { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }}>
          Import from File
        </button>
        <input ref={fileInputRef} type="file" accept=".txt,.html,.md" className="hidden" onChange={setFileContent}/>
      </div>
      <div className="border border-gray-600 rounded bg-gray-700 text-gray-100 p-2 min-h-[120px]">
        <EditorContent editor={editor}/>
      </div>
    </div>);
}
