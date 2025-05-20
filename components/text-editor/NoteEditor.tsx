"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { MenuBar } from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";

type NoteEditorProps = {
  content: string;
  onChange: (value: string) => void;
};

export default function NoteEditor({ content, onChange }: NoteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // ส่งค่ากลับเมื่อพิมพ์
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  return (
    <div className="rounded min-h-screen">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
