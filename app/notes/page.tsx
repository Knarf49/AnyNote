"use client";

import { useState } from "react";
import NoteEditor from "@/components/text-editor/NoteEditor";
import { MenuBar } from "@/components/text-editor/menu-bar";

export default function NotePage() {
  const [content, setContent] = useState("");

  return (
    <div className="max-w-2xl mx-auto w-full min-h-screen">
      <NoteEditor content={content} onChange={setContent} />
    </div>
  );
}
