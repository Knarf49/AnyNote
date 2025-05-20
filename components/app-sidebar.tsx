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
import { CalendarArrowDown, FilePlus2, FolderPlus } from "lucide-react";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "new note",
    icon: FilePlus2,
  },
  {
    title: "new folder",
    icon: FolderPlus,
  },
  {
    title: "sort by date",
    icon: CalendarArrowDown,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="floating" className="mt-20 ml-4 h-fit">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div className="cursor-pointer">
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
