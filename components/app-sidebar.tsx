"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { createClient } from "@/utils/supabase/client";
import { Ellipsis, FilePlus2, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Note } from "@/utils/supabase/type";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function AppSidebar() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const supabase = createClient();

  // Load all notes
  const loadNotes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setNotes(data);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  //create note
  const createNote = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          title: "Untitled Note",
          content: "",
          user_id: user?.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating note:", error);
    } else if (data) {
      setNotes((prev) => [data, ...prev]); // แสดง note ใหม่ใน sidebar
    }

    setLoading(false);
  };

  // Rename note
  const handleRename = (note: Note) => {
    setEditingNoteId(note.id);
    setNewTitle(note.title);
  };

  const handleRenameSubmit = async () => {
    if (!editingNoteId) return;

    const { error } = await supabase
      .from("notes")
      .update({ title: newTitle })
      .eq("id", editingNoteId);

    if (!error) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNoteId ? { ...note, title: newTitle } : note
        )
      );
    }

    setEditingNoteId(null);
    setNewTitle("");
  };

  //Delete note
  const deleteNote = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (!error) {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    }
  };

  return (
    <Sidebar variant="floating" className="mt-20 ml-4 h-fit">
      <SidebarContent className="py-4">
        {/* Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => createNote()}>
                  <div className="cursor-pointer">
                    <FilePlus2 />
                    <span>New Note</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Your notes */}
        {/* Your Notes */}
        <SidebarGroupLabel className="ml-2">Your Notes</SidebarGroupLabel>
        <SidebarGroupContent className="px-2">
          {notes.map((note) => (
            <SidebarMenuItem className="list-none relative" key={note.id}>
              {editingNoteId === note.id ? (
                <Input
                  value={newTitle}
                  autoFocus
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewTitle(e.target.value)
                  }
                  onBlur={handleRenameSubmit}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      handleRenameSubmit();
                    } else if (e.key === "Escape") {
                      setEditingNoteId(null);
                    }
                  }}
                  className="text-sm px-2 py-1"
                />
              ) : (
                <Link
                  href={`/notes/${note.id}`}
                  className="block p-2 hover:bg-secondary rounded"
                >
                  {note.title || "Untitled"}
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild className="absolute top-1 right-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-inherit"
                  >
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handleRename(note)}>
                      Rename
                      <DropdownMenuShortcut>
                        <Pencil />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteNote(note.id)}>
                      <span className="text-destructive">Delete</span>
                      <DropdownMenuShortcut>
                        <Trash />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarGroupContent>
      </SidebarContent>
    </Sidebar>
  );
}
