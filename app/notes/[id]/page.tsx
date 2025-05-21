"use client";
// TODO: ทำให้การfetch note มัน realtime มากขึ้น ถ้าลบแล้ว หน้า dynamic route ต้องหายไปเลย
//TODO: สร้าง default note ที่ลบไม่ได้ ถ้าลบอันไหนแล้วจะ redirect มาที่ default
import NoteEditor from "@/components/text-editor/NoteEditor";
import { createClient } from "@/utils/supabase/client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();
  const { id } = use(params);

  const supabase = createClient();
  useEffect(() => {
    const fetchNote = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("content")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error fetching note:", error);
        setNotFound(true);
        router.push("/notes");
        return;
      }
      setContent(data?.content || "");

      setLoading(false);
    };

    fetchNote();
  }, [id, router, supabase]);

  if (loading) return <p>Loading...</p>;
  if (notFound)
    return (
      <p className="text-center mt-24 text-muted-foreground">
        No note found...
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto w-full min-h-screen">
      <NoteEditor noteId={id} content={content} onChange={setContent} />
    </div>
  );
}
