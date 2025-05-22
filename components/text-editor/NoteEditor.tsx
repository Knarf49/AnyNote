"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { MenuBar } from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { createClient } from "@/utils/supabase/client";
import debounce from "lodash.debounce";

type NoteEditorProps = {
  content: string;
  noteId?: string;
  onChange: (value: string) => void;
};

export default function NoteEditor({
  noteId,
  content,
  onChange,
}: NoteEditorProps) {
  const supabase = createClient();
  // Save to database
  const saveToDatabase = debounce(async (html: string) => {
    const { error } = await supabase
      .from("notes")
      .update({ content: html })
      .eq("id", noteId)
      .select();
  }, 500);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "my-custom-class",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html); // ส่งค่ากลับเมื่อพิมพ์
      saveToDatabase(html); // ✅ auto-save ไปที่ Supabase ด้วย
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  return (
    <>
      <div className="fixed top-16">
        <MenuBar editor={editor} />
      </div>
      <div className="min-h-screen px-2 mt-36 md:mt-8">
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
