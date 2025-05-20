"use client";

import { useState } from "react";
import NoteEditor from "@/components/text-editor/NoteEditor";
import { MenuBar } from "@/components/text-editor/menu-bar";

export default function NotePage() {
  const [content, setContent] = useState("<p>start typing your note...</p>");

  return (
    <div className="max-w-2xl mx-auto mt-8 w-full min-h-screen">
      <NoteEditor content={content} onChange={setContent} />
    </div>
  );
}
