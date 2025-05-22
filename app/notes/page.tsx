"use client";

import { useEffect, useState } from "react";
import NoteEditor from "@/components/text-editor/NoteEditor";
import { createClient } from "@/utils/supabase/client";
import { NotebookPen } from "lucide-react";

export default function NotePage() {
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto w-full min-h-screen py-10">
      {user ? (
        <div className="flex flex-col items-center py-10 gap-y-4">
          <NotebookPen />
          <h2 className="text-center font-semibold text-xl">No note left...</h2>
          <p className="opacity-80">Open sidebar to create new note</p>
        </div>
      ) : (
        <NoteEditor content={content} onChange={setContent} />
      )}
    </div>
  );
}
